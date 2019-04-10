/*
 * Registration endpoints for visitors
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { id, response } from '../schema';
import {
  Visitors,
  CommunityBusinesses,
  CbAdmins,
  Users,
  Volunteers,
  User,
} from '../../../../models';
import * as QRCode from '../../../../services/qrcode';
import * as PdfService from '../../../../services/pdf';
import { EmailTemplate } from '../../../../services/email/templates';
import { RegisterConfirm } from '../../types';
import { RoleEnum, Roles } from '../../../../auth';

export default [
  {
    method: 'POST',
    path: '/users/register/confirm',
    options: {
      description: 'Confirm adding a new role to an existing user',
      auth: false,
      validate: {
        payload: {
          organisationId: id.required(),
          userId: id.required(),
          role: Joi.alternatives(RoleEnum.VOLUNTEER, RoleEnum.VISITOR).required(),
          token: Joi.string().length(64).required(),
        },
      },
      response: { schema: response },
    },
    handler: async (request: RegisterConfirm, h: Hapi.ResponseToolkit) => {
      const {
        payload: { role, userId, token, organisationId },
        server: { app: { EmailService, knex, config } },
      } = request;
      const cb = await CommunityBusinesses.getOne(knex, { where: { id: organisationId } });
      const user = await Users.getOne(knex, { where: { id: userId } });

      const [admin] = await CbAdmins.fromOrganisation(knex, { id: organisationId });

      /* istanbul ignore next */
      if (!admin) {
        // Because of a change in testing method, this is now unreachable
        // (and was always functionally impossible), but is kept **just
        // in case**
        throw Boom.badData('No associated admin for this organisation');
      }

      // Checks
      // check role doesnt exist on user account
      if (await Roles.userHas(knex, user, role)) {
        throw Boom.conflict(
          `${Roles.toDisplay(role)} with this e-mail already registered`);
      }
      // currently not supporting roles at different cbs
      if (!(await Users.isMemberOf(knex, user, cb))) {
        throw Boom.conflict(
          'User with this e-mail already registered at another Community Business');
      }
      /*
       * Main actions
       */

      // Create the account
      try {
        switch (role) {
          case RoleEnum.VISITOR:
            let updatedVisitor: User;
            let document: string;

            await knex.transaction(async (trx) => {
              await Users.useConfirmAddRoleToken(trx, user.email, token);
              await Roles.add(trx, { role, userId, organisationId });
              updatedVisitor = await Users.getOne(trx, { where: { id: user.id } });

              // generate & add QR CODE
              const userWithQr = await Users.update(trx, user,
              { qrCode: Visitors.create(updatedVisitor).qrCode });
              const qrCode = await QRCode.create(userWithQr.qrCode);
              document = await PdfService.fromTemplate(
                PdfService.PdfTemplateEnum.VISITOR_QR_CODE,
                { qrCodeDataUrl: qrCode }
              );
              return;
            });
            await EmailService.sendBatch([
              {
                from: config.email.fromAddress,
                to: updatedVisitor.email,
                templateId: EmailTemplate.WELCOME_VISITOR,
                templateModel: { name: updatedVisitor.name, organisation: cb.name },
                attachments: [{
                  name: `${updatedVisitor.name}-QrCode.pdf`,
                  content: document,
                  contentType: 'application/octet-stream',
                }],
              },
              {
                from: config.email.fromAddress,
                to: admin.email,
                templateId: EmailTemplate.NEW_VISITOR_CB_ADMIN,
                templateModel: { name: updatedVisitor.name, email: updatedVisitor.email },
                attachments: [{
                  name: `${updatedVisitor.name}-QrCode.pdf`,
                  content: document,
                  contentType: 'application/octet-stream',
                }],
              },
            ]);
            return Visitors.serialise(updatedVisitor);

          case RoleEnum.VOLUNTEER:
            return knex.transaction(async (trx) => {
              await Users.useConfirmAddRoleToken(trx, user.email, token);
              await Roles.add(trx, { role, userId, organisationId });
              const updatedVolunteer = await Users.getOne(trx, { where: { id: user.id } });

              // create password reset token & send with response
              const { token: newToken } = await Users
                .createPasswordResetToken(trx, updatedVolunteer);
              return { ...await Volunteers.serialise(updatedVolunteer), token: newToken };
            });

          default:
            throw Boom.internal('Could not create role');
        }
      } catch (error) {
        request.log('warning', error);
        return Boom.unauthorized('Invalid token. Request another reset e-mail.');
      }
    },
  },
] as Hapi.ServerRoute[];
