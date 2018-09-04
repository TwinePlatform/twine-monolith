import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { compare } from 'bcrypt';
import { Users, Organisations } from '../../../models';
import { email, password, response } from './schema';
import { CbAdmins } from '../../../models/cb_admin';
import { Session } from '../../../auth/strategies/standard';
import { LoginRequest, EscalateRequest } from '../types';


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
    path: '/users/login/admin',
    options: {
      description: 'Login all accounts apart from visitor',
      auth: false,
      validate: {
        payload: {
          email: email.required(),
          password: password.required(),
        },
      },
      response: { schema: response },
    },
    handler: async (request: LoginRequest, h: Hapi.ResponseToolkit) => {
      const { knex } = request;
      const { email, password } = request.payload;

      const user = await Users.getOne(knex, { where: { email } });
      if (! user) return Boom.unauthorized('Unknown account');

      const authorisePassword = await compare(password, user.password);
      if (!authorisePassword) return Boom.unauthorized('Incorrect password');

      const isAdmin = await CbAdmins.exists(knex, { where: { email } });
      if (!isAdmin) return Boom.unauthorized('User is not admin');

      const organisation = await Organisations.fromUser(knex, { where: { email } });
      if (!organisation) return Boom.unauthorized('User has no associated organisation');

      return Session.create(
        request,
        h.response({}),
        { userId: user.id, organisationId: organisation.id },
        inferPrivilegeLevel(request)
      );
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
      const { payload: { password }, auth: { credentials } } = request;

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
