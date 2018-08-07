import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as jwt from 'jsonwebtoken';

import { compare } from 'bcrypt';
import { Users, Organisations } from '../../../models';
import { email, password, response } from './schema';
import { CbAdmins } from '../../../models/cb_admin';
import { getConfig } from '../../../../config';

interface RequestLogin extends Hapi.Request {
  payload: {
    email: string,
    password: string,
  };
}

const { secret: { jwt_secret: jwtSecret } } = getConfig(process.env.NODE_ENV);

const route: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/users/login',
    options: {
      description: 'Login all accounts apart from visitor',
      auth: false,
      validate: { payload: {
        email: email.required(),
        password: password.required(),
      } },
      response: { schema: response },
    },
    handler: async (request: RequestLogin, h: Hapi.ResponseToolkit) => {
      const { knex } = request;
      const { email, password } = request.payload;

      const user = await Users.getOne(knex, { where: { email } });
      if (! user) return Boom.unauthorized('Unknown account');

      const authorisePassword = await compare(password, user.password);
      if (!authorisePassword) return Boom.unauthorized('Incorrect password');

      const isAdmin = await CbAdmins.exists(knex, { where: { email } });
      if (!isAdmin) return Boom.unauthorized('User is not admin');

      const organisation = await Organisations.fromUser(knex, { where: { email } });
      const token =
        await jwt.sign({ userId: user.id, organisationId: organisation.id }, jwtSecret);

      return { token };
    },
  },
];

export default route;
