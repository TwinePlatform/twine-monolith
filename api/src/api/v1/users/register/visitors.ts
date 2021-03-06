/*
 * Registration endpoints for visitors
 */
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import {
  id,
  userName,
  birthYear,
  email,
  phoneNumber,
  postCode,
  isEmailConsentGranted,
  isSMSConsentGranted,
  gender,
  response
} from '../schema';
import { Visitors, CommunityBusinesses, CbAdmins, Users, } from '../../../../models';
import * as QRCode from '../../../../services/qrcode';
import * as PdfService from '../../../../services/pdf';
import { Api } from '../../types/api';
import { Credentials as StandardCredentials } from '../../../../auth/strategies/standard';
import { getCommunityBusiness } from '../../prerequisites';
import Roles from '../../../../models/role';
import { RoleEnum } from '../../../../models/types';
import { Tokens } from '../../../../models/token';
import { Serialisers } from '../../serialisers';

const routes: [Api.Users.Register.Visitors.POST.Route] = [
  {
    method: 'POST',
    path: '/users/register/visitors',
    options: {
      auth: {
        strategy: 'standard',
        scope: ['user_details-child:write'],
      },
      validate: {
        payload: {
          organisationId: id.required(),
          name: userName.required(),
          gender: gender.required(),
          birthYear: birthYear.default(null),
          email,
          phoneNumber,
          postCode,
          isEmailConsentGranted: isEmailConsentGranted.default(false),
          isSMSConsentGranted: isSMSConsentGranted.default(false),
          isAnonymous: Joi.boolean().default(false) ,
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        payload,
        server: { app: { EmailService, knex, config } },
        pre: { communityBusiness },
      } = request;

      const { organisation } = StandardCredentials.fromRequest(request);
      /*
       * Preliminaries
       * (Can possibly eventually be removed into pre-requisites)
       */

      // Checks for standard Visitors
      if (!payload.isAnonymous) {
        // Check email or phone number is supplied
        if (!(payload.email || payload.phoneNumber)) {
          return Boom.badRequest('Please supply either email or phone number');
        }
        // Check if user already exists
        if (payload.email && await Users.exists(knex, { where: { email: payload.email } })) {
          // Registering second role
          const user = await Users.getOne(knex, { where: { email: payload.email } });
          // check role doesnt exist on user account
          if (await Roles.userHas(knex, user, RoleEnum.VISITOR)) {
            throw Boom.conflict(
              'Visitor with this e-mail already registered');
          }
          // check user is VOLUNTEER - only role allowed to have an additional role
          if (!(await Roles.userHas(knex, user, RoleEnum.VOLUNTEER))) {
            throw Boom.conflict(
              'User with this e-mail already registered');
          }
          // currently not supporting roles at different cbs
          if (!(await Users.isMemberOf(knex, user, communityBusiness))) {
            throw Boom.conflict(
              'User with this e-mail already registered at another Community Business');
          }

          const { token } = await Tokens.createConfirmAddRoleToken(knex, user);

          try {
            await EmailService.addRole(config, user, communityBusiness, RoleEnum.VISITOR, token);

          } catch (error) {
            /*
             * we should do something meaningful here!
             * such as retry with backoff and log/email
             * dev team if unsuccessful
             */
            return Boom.badGateway('E-mail service unavailable');
          }
          throw Boom.conflict(
            'Email is associated to a volunteer, '
            + 'please see email confirmation to create visitor account'
          );
        }
        if (payload.phoneNumber
          && await Users.exists(knex, { where: { phoneNumber: payload.phoneNumber } })
        ) {
        // Registering second roles is not yet supported;
        // see https://github.com/TwinePlatform/twine-api/issues/247#issuecomment-443182884
          throw Boom.conflict('User with this phone number already registered');
        }
      }

      if (organisation && organisation.id !== payload.organisationId) {
        throw Boom.badRequest('Cannot register visitor for different organisation');
      }
      if (!(await CommunityBusinesses.exists(knex, { where: { id: payload.organisationId } }))) {
        throw Boom.badRequest('Unrecognised organisation');
      }

      // Fetch the community business
      const cb = await CommunityBusinesses.getOne(knex, {
        where: { id: payload.organisationId, deletedAt: null },
      });
      const [admin] = await CbAdmins.fromOrganisation(knex, { id: payload.organisationId });

      /* istanbul ignore next */
      if (!admin) {
        // Because of a change in testing method, this is now unreachable
        // (and was always functionally impossible), but is kept **just
        // in case**
        throw Boom.badData('No associated admin for this organisation');
      }

      /*
       * Main actions
       */

      // Create the visitor
      const visitor = payload.isAnonymous
        ? await Visitors.addAnonymousWithRole(knex, cb, Visitors.create(payload))
        : await Visitors.addWithRole(knex, cb, Visitors.create(payload));

      // Send QR code to visitor
      // generate QR code data URL
      const qrCode = await QRCode.create(visitor.qrCode);
      // create PDF blob
      const document = await PdfService.fromTemplate(
        PdfService.PdfTemplateEnum.VISITOR_QR_CODE,
        { qrCodeDataUrl: qrCode }
      );

      /*
      * Auxilliary actions
      */

      // send email to visitor QR code attached
      // send sign-up notification to cb-admin
      // TODO: This should be hidden away
      await EmailService.newVisitor(config, visitor, admin, cb, document);

      /*
       * Response payload
       */
      return Serialisers.visitors.noSecrets(visitor);
    },
  },
];

export default routes;
