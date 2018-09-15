import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users } from '../../../models';
import { response, email as emailSchema } from './schema';
import { EmailTemplate } from '../../../services/email/templates';

interface ForgotRequest extends Hapi.Request {
  payload: {
    email: string
  };
}

const routes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/users/password/forgot',
    options: {
      description: 'Send password reset link for a single user',
      auth: false,
      validate: {
        payload: { email: emailSchema },
      },
      response: { schema: response },
    },
    handler: async (request: ForgotRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex, EmailService } }, payload: { email } } = request;
      const exists = await Users.exists(knex, { where: { email } });

      if (!exists) return Boom.badRequest('E-mail not recognised');

      const { token } = await Users.createPasswordResetToken(knex, { email });

      try {
        await EmailService.send({
          from: 'visitorapp@powertochange.org.uk', // this shouldn't be hardcoded
          to: email,
          templateId: EmailTemplate.USER_PASSWORD_RESET,
          templateModel: {
            email,
            token,
          },
        });
      } catch (error) {
        /*
         * we should do something meaningful here!
         * such as retry with backoff and log/email
         * dev team if unsuccessful
         */
        return Boom.badGateway('E-mail service unavailable');
      }
      return {};
    },
  },
];

export default routes;
