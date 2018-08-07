/*
 * Registration endpoints for users
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import {
  id,
  visitorName,
  birthYear,
  email,
  phoneNumber,
  postCode,
  emailConsent,
  smsConsent,
  gender,
  response
} from './schema';
import { Visitors, CommunityBusinesses, CbAdmins } from '../../../models';
import * as QRCode from '../../../services/qrcode';
import * as PdfService from '../../../services/pdf';
import { EmailTemplate } from '../../../services/email/templates';
import { RoleEnum } from '../../../auth/types';
import Roles from '../../../auth/roles';


interface RegisterRequest extends Hapi.Request {
  payload: {
    organisationId: number
    name: string
    gender: string
    birthYear: number
    email: string
    phoneNumber: string
    postCode: string
    emailConsent: boolean
    smsConsent: boolean
  };
}


export default [
  {
    method: 'POST',
    path: '/users/register/visitor',
    options: {
      auth: {
        strategy: 'standard',
        scope: ['user_details-child:write'],
      },
      validate: {
        payload: {
          organisationId: id.required(),
          name: visitorName.required(),
          gender: gender.required(),
          birthYear: birthYear.required(),
          email: email.required(),
          phoneNumber: phoneNumber.allow(''),
          postCode: postCode.allow(''),
          emailConsent: emailConsent.default(false),
          smsConsent: smsConsent.default(false),
        },
      },
      response: { schema: response },
    },
    handler: async (request: RegisterRequest, h: Hapi.ResponseToolkit) => {
      const { knex, payload, server: { app: { EmailService } } } = request;

      /*
       * Preliminaries
       * (Can possibly eventually be removed into pre-requisites)
       */
      // Check user doesn't already exist
      if (await Visitors.exists(knex, { where: { email: payload.email } })) {
        throw Boom.conflict('User with this e-mail already registered');
      }
      if (!(await CommunityBusinesses.exists(knex, { where: { id: payload.organisationId } }))) {
        throw Boom.badRequest('Unrecognised organisation');
      }

      // Fetch the community business admin
      const cb = await CommunityBusinesses.getOne(knex, {
        where: { id: payload.organisationId, deletedAt: null },
      });
      const [admin] = await CbAdmins.fromOrganisation(knex, { id: payload.organisationId });

      if (!admin) {
        throw Boom.badData('No associated admin for this organisation');
      }

      /*
       * Main actions
       */
      // Create the visitor
      // // TODO: This should actually be part of the Visitor model
      // //       However, this breaks the typings and it's not obvious
      // //       right now how to accomodate it.
      const visitor = await knex.transaction(async (trx) => {
        const visitor = await Visitors.add(trx, Visitors.create(payload));
        await Roles.add(trx, {
          role: RoleEnum.VISITOR,
          userId: visitor.id,
          organisationId: payload.organisationId,
        });
        return visitor;
      });

      // Send QR code to visitor
      // // generate QR code data URL
      const qrCode = await QRCode.create(visitor.qrCode);
      // // create PDF blob
      const document = await PdfService.fromTemplate(
        PdfService.PdfTemplateEnum.VISITOR_QR_CODE,
        { qrCodeDataUrl: qrCode }
      );

      // // send email to visitor QR code attached
      // // send sign-up notification to cb-admin
      // // // TODO: This should be hidden away
      await EmailService.sendBatch([
        {
          from: 'visitorapp@powertochange.org.uk', // this shouldn't be hardcoded
          to: visitor.email,
          templateId: EmailTemplate.WELCOME_VISITOR,
          templateModel: { name: visitor.name, organisation: cb.name },
          attachements: [{
            name: `${visitor.name}-QrCode.pdf`,
            content: document,
            contentType: 'application/octet-stream',
          }],
        },
        {
          from: 'visitorapp@powertochange.org.uk', // this shouldn't be hardcoded
          to: admin.email,
          templateId: EmailTemplate.NEW_VISITOR_FOR_CB,
          templateModel: { name: visitor.name, email: visitor.email },
          attachements: [{
            name: `${visitor.name}-QrCode.pdf`,
            content: document,
            contentType: 'application/octet-stream',
          }],
        },
      ]);

      /*
       * Auxilliary actions
       */
      // Register login event
      await Visitors.recordLogin(knex, visitor);

      /*
       * Response payload
       */
      return visitor;
    },
  },
] as Hapi.ServerRoute[];
