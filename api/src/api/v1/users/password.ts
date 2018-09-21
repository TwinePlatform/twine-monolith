import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { hash } from 'bcrypt';
import { User, Users } from '../../../models';
import {
  response,
  email as emailSchema,
  password as passwordSchema,
} from './schema';
import { EmailTemplate } from '../../../services/email/templates';
import { JoiBoomError } from '../utils';


interface ForgotPasswordRequest extends Hapi.Request {
  payload: {
    email: string
  };
}

interface ResetPasswordRequest extends Hapi.Request {
  payload: {
    token: string
    password: string
    passwordConfirm: string
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
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
    },
    handler: async (request: ForgotPasswordRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex, EmailService } }, payload: { email } } = request;
      const exists = await Users.exists(knex, { where: { email } });

      if (!exists) return Boom.badRequest('E-mail not recognised');

      const { token } = await Users.createPasswordResetToken(knex, { email });

      try {
        await EmailService.send({
          from: 'visitorapp@powertochange.org.uk',
          to: email,
          templateId: EmailTemplate.USER_PASSWORD_RESET,
          templateModel: { email, token },
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

  {
    method: 'POST',
    path: '/users/password/reset',
    options: {
      description: 'Reset password for a single user',
      auth: false,
      validate: {
        payload: {
          token: Joi.string().length(64),
          password: passwordSchema,
          passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
            .options({ language: { any: {
              required: 'password confirmation is required',
              allowOnly: 'must match password',
            } } }),
        },
        failAction: (request, h, err) => {
          if ((<JoiBoomError> err).details[0].message
            === '"token" length must be 64 characters long') {
            return Boom.unauthorized('Invalid token. Reset password again.');
          }
          return err;
        },
      },
      response: { schema: response },
    },
    handler: async (request: ResetPasswordRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        payload: { token, password },
      } = request;
      let user: User;

      try {
        user = await Users.fromPasswordResetToken(knex, token);
      } catch (error) {
        request.log('warning', error);
        return Boom.unauthorized('Invalid token. Reset password again.');
      }

      const hashedPw = await hash(password, 10);

      await Users.update(knex, user, { password: hashedPw });

      return null;
    },
  },
];

export default routes;
