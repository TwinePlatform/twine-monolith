/*
 * Registration endpoints for visitors
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
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
import {
  Visitors,
  CommunityBusinesses,
  CbAdmins,
  Users,
} from '../../../../models';
import * as QRCode from '../../../../services/qrcode';
import * as PdfService from '../../../../services/pdf';
import { EmailTemplate } from '../../../../services/email/templates';
import { RegisterRequest } from '../../types';
import { StandardCredentials } from '../../../../auth/strategies/standard';

export default [
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
          postCode: postCode.allow(''),
          emailConsent: isEmailConsentGranted.default(false),
          smsConsent: isSMSConsentGranted.default(false),
          isAnonymous: Joi.boolean().default(false) ,
        },
      },
      response: { schema: response },
    },
    handler: async (request: RegisterRequest, h: Hapi.ResponseToolkit) => {
      const {
        payload,
        server: { app: { EmailService, knex } },
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
        // Check user doesn't already exist
        if (payload.email && await Users.exists(knex, { where: { email: payload.email } })) {
        // Registering second roles is not yet supported;
        // see https://github.com/TwinePlatform/twine-api/issues/247#issuecomment-443182884
          throw Boom.conflict('User with this e-mail already registered');
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
      await EmailService.sendBatch([
        {
          from: 'visitorapp@powertochange.org.uk', // this shouldn't be hardcoded
          to: visitor.email,
          templateId: EmailTemplate.VISITOR_WELCOME,
          templateModel: { name: visitor.name, organisation: cb.name },
          attachments: [{
            name: `${visitor.name}-QrCode.pdf`,
            content: document,
            contentType: 'application/octet-stream',
          }],
        },
        {
          from: 'visitorapp@powertochange.org.uk', // this shouldn't be hardcoded
          to: admin.email,
          templateId: EmailTemplate.CB_ADMIN_NEW_VISITOR,
          templateModel: { name: visitor.name, email: visitor.email },
          attachments: [{
            name: `${visitor.name}-QrCode.pdf`,
            content: document,
            contentType: 'application/octet-stream',
          }],
        },
      ]);

      // Register login event
      await Visitors.recordLogin(knex, visitor);

      /*
       * Response payload
       */
      return Visitors.serialise(visitor);
    },
  },
] as Hapi.ServerRoute[];
