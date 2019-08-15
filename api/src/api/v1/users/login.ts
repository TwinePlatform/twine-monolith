import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { compare } from 'bcrypt';
import { quiet } from 'twine-util/promises';
import { Users, Organisations } from '../../../models';
import { email, DEPRECATED_password, response } from './schema';
import { Sessions } from '../../../auth/strategies/standard';
import { LoginRequest } from '../types';
import Roles from '../../../models/role';
import { RoleEnum } from '../../../models/types';
import { UserSessionRecords } from '../../../models/user_session_record';


const route: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/users/login',
    options: {
      description: 'Login all accounts apart from visitor',
      auth: false,
      validate: {
        payload: {
          restrict: Joi.alt()
            .try(
              Joi.string().only(Object.values(RoleEnum)),
              Joi.array().items(Joi.string().only(Object.values(RoleEnum)))
            ),
          type: Joi.string().only('cookie', 'body').default('cookie'),
          email: email.required(),
          password: DEPRECATED_password.required(),
        },
      },
      response: { schema: response },
    },
    handler: async (request: LoginRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } } } = request;
      const { email, password, restrict, type } = request.payload;

      const user = await Users.getOne(knex, { where: { email } });
      if (! user) return Boom.unauthorized('Unknown account');

      const organisation = await Organisations.fromUser(knex, { where: { email } });
      if (!organisation) return Boom.unauthorized('User has no associated organisation');

      if (restrict) {
        const hasRole = await Roles.userHasAtCb(knex, {
          userId: user.id,
          organisationId: organisation.id,
          role: restrict,
        });

        if (!hasRole) {
          return Boom.forbidden('User does not have required role');
        }
      }

      const isPwdValid = await compare(password, user.password);
      if (!isPwdValid) return Boom.unauthorized('Incorrect password');

      Sessions.authenticate(request, user.id, organisation.id);

      quiet(UserSessionRecords.initSession(
        knex,
        user,
        organisation,
        request.yar.id,
        [request.headers.referrer]
      ));

      return type === 'body'
        ? { token: request.yar.id }
        : null;
    },
  },
];

export default route;
