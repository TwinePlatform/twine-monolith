import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { Users } from '../../../models';
import {
  response,
  email as emailSchema,
  password as passwordSchema,
} from './schema';
import { Templates } from '../../../services/email';
import { BoomWithValidation } from '../utils';
import { AppEnum } from '../../../types/internal';


interface ForgotPasswordRequest extends Hapi.Request {
  payload: {
    email: string
    redirect: AppEnum.ADMIN | AppEnum.VISITOR | AppEnum.DASHBOARD
  };
}

interface ResetPasswordRequest extends Hapi.Request {
  payload: {
    email: string
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
        payload: {
          email: emailSchema.required(),
          redirect: Joi.allow([
            AppEnum.ADMIN,
            AppEnum.VISITOR,
            AppEnum.DASHBOARD,
          ]).default(AppEnum.ADMIN),
        },
      },
      response: { schema: response },
    },
    handler: async (request: ForgotPasswordRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex, EmailService, config } },
        payload: { email, redirect },
      } = request;
      const user = await Users.getOne(knex, { where: { email } });

      if (!user) return Boom.badRequest('E-mail not recognised');

      const { token } = await Users.createPasswordResetToken(knex, user);

      const templateId = Templates.passwordResetForApp(redirect);

      try {
        await EmailService.send({
          from: config.email.fromAddress,
          to: email,
          templateId,
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
          token: Joi.string().length(64).required(),
          email: emailSchema.required(),
          password: passwordSchema.required(),
          passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
            .options({ language: { any: {
              required: 'password confirmation is required',
              allowOnly: 'must match password',
            } } }),
        },
        failAction: (request, h, err) => {
          if ((<BoomWithValidation> err).details[0].message
            === '"token" length must be 64 characters long') {
            return Boom.unauthorized('Invalid token. Request another reset e-mail.');
          }
          return err;
        },
      },
      response: { schema: response },
    },
    handler: async (request: ResetPasswordRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        payload: { token, password, email },
      } = request;
      const user = await Users.getOne(knex, { where: { email } });
      if (!user) {
        return Boom.forbidden('User does not exist');
      }
      try {
        await Users.usePasswordResetToken(knex, user.email, token);
      } catch (error) {
        request.log('warning', error);
        return Boom.unauthorized('Invalid token. Request another reset e-mail.');
      }

      await Users.update(knex, user, { password });

      return null;
    },
  },
];

export default routes;
