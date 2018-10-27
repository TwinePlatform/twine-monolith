import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { response, id } from '../schema';
import { isChildUser } from '../../prerequisites';
import { Visitors, CommunityBusinesses } from '../../../../models';
import { EmailTemplate } from '../../../../services/email/templates';
import * as PdfService from '../../../../services/pdf';
import * as QRCode from '../../../../services/qrcode';


interface UserEmailRequest extends Hapi.Request {
  params: {
    userId: string
  };
  payload: {
    type: 'qrcode'
  };
  pre: {
    isChild: boolean
  };
}

const routes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/community-businesses/me/visitors/{userId}/emails',
    options: {
      description: 'Send visitors emails',
      auth: {
        strategy: 'standard',
        scope: ['user_details-child:write'],
      },
      validate: {
        params: {
          userId: id.required(),
        },
        payload: {
          // NOTE: As soon as this value can take more than one value,
          //       the handler must be explicitly changed to support it.
          type: Joi.any().only(['qrcode']),
        },
      },
      response: { schema: response },
      pre: [
        { method: isChildUser, assign: 'isChild' },
      ],
    },
    handler: async (request: UserEmailRequest, h) => {
      const {
        auth: { credentials: { user, organisation } },
        pre: { isChild },
        params: { userId },
        server: { app: { knex, EmailService } },
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const cb = await CommunityBusinesses.getOne(knex, { where: { id: organisation.id } });

      const [visitor] = await Visitors.fromCommunityBusiness(
        knex,
        cb,
        { where: { id: Number(userId) } }
      );

      // Send QR code to visitor
      // // generate QR code data URL
      const qrCode = await QRCode.create(visitor.qrCode);
      // // create PDF blob
      const document = await PdfService.fromTemplate(
        PdfService.PdfTemplateEnum.VISITOR_QR_CODE,
        { qrCodeDataUrl: qrCode }
      );

      try {
        await EmailService.send({
          from: user.email,
          to: visitor.email,
          templateId: EmailTemplate.VISITOR_WELCOME,
          templateModel: { name: visitor.name, organisation: cb.name },
          attachments: [{
            name: `${visitor.name}-QrCode.pdf`,
            content: document,
            contentType: 'application/octet-stream',
          }],
        });

        return null;

      } catch (error) {
        return Boom.badGateway(error);

      }
    },
  },
];


export default routes;
