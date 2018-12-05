import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { compare } from 'bcrypt';
import { Users, Organisations } from '../../../models';
import { email, DEPRECATED_password, password, response } from './schema';
import { Session, Token, StandardCredentials } from '../../../auth/strategies/standard';
import { LoginRequest, EscalateRequest } from '../types';
import { RoleEnum } from '../../../auth/types';
import Roles from '../../../auth/roles';


const inferPrivilegeLevel = (request: Hapi.Request) => {
  const { origin } = request.headers;

  switch (origin) {
    case 'https://visitor.twine-together.com':
    case 'http://localhost:3000':
      return 'restricted';
    default:
      return 'full';
  }
};

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

      const authorisePassword = await compare(password, user.password);
      if (!authorisePassword) return Boom.unauthorized('Incorrect password');

      const organisation = await Organisations.fromUser(knex, { where: { email } });
      if (!organisation) return Boom.unauthorized('User has no associated organisation');

      if (restrict) {
        const hasRole = await Roles.userHas(
          knex,
          { userId: user.id, organisationId: organisation.id, role: restrict }
        );

        if (!hasRole) {
          return Boom.forbidden('User does not have required role');
        }
      }

      try {
        await Users.recordLogin(knex, user);
      } catch (error) {
        request.log('warning', `Recording user login failed: ${user.id}`);
      }

      if (type === 'cookie') {
        return Session.create(
          request,
          h.response({}),
          { userId: user.id, organisationId: organisation.id },
          inferPrivilegeLevel(request)
        );
      } else {
        return {
          token: Token.create({
            userId: user.id,
            organisationId: organisation.id,
            privilege: inferPrivilegeLevel(request),
          }),
        };
      }
    },
  },

  {
    method: 'POST',
    path: '/users/login/escalate',
    options: {
      auth: {
        strategy: 'standard',
      },
      validate: {
        payload: {
          password: password.required(),
        },
      },
      response: { schema: response },
    },
    handler: async (request: EscalateRequest, h: Hapi.ResponseToolkit) => {
      const { payload: { password } } = request;
      const credentials = StandardCredentials.fromRequest(request);

      const matches = await compare(password, credentials.user.password);

      if (!matches) {
        return Boom.unauthorized('Password invalid');
      }

      return Session.escalate(request, h.response({}));
    },
  },

  {
    method: 'POST',
    path: '/users/login/de-escalate',
    options: {
      auth: {
        strategy: 'standard',
      },
      response: { schema: response },
    },
    handler: async (request: EscalateRequest, h: Hapi.ResponseToolkit) => {
      return Session.deescalate(request, h.response({}));
    },
  },
];

export default route;
