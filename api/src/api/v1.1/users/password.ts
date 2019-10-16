import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { Users } from '../../../models';
import { response, email as emailSchema, password as passwordSchema } from './schema';
import { BoomWithValidation } from '../utils';
import { AppEnum } from '../../../types/internal';
import { Tokens } from '../../../models/token';
import { Api } from '../types/api';


const routes: [
  Api.Users.Password.Forgot.POST.Route,
  Api.Users.Password.Reset.POST.Route,
] = [
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
    handler: async (request, h) => {
      const {
        server: { app: { knex, EmailService, config } },
        payload: { email, redirect },
      } = request;
      const user = await Users.getOne(knex, { where: { email } });

      if (!user) return Boom.badRequest('E-mail not recognised');

      const { token } = await Tokens.createPasswordResetToken(knex, user);

      try {
        await EmailService.resetPassword(config, redirect, user, token);
        return null;

      } catch (error) {
        /*
         * we should do something meaningful here!
         * such as retry with backoff and log/email
         * dev team if unsuccessful
         */
        return Boom.badGateway('E-mail service unavailable');
      }
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
          if ((err as BoomWithValidation).details[0].message
            === '"token" length must be 64 characters long') {
            return Boom.unauthorized('Invalid token. Request another reset e-mail.');
          }
          return err;
        },
      },
      response: { schema: response },
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        payload: { token, password, email },
      } = request;

      const user = await Users.getOne(knex, { where: { email } });
      if (!user) {
        return Boom.forbidden('User does not exist');
      }

      try {
        await Tokens.usePasswordResetToken(knex, user.email, token);
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
