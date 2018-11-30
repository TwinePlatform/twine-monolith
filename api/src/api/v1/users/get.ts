import * as Hapi from 'hapi';
import { Users } from '../../../models';
import { query, response } from './schema';
import { Credentials } from '../../../auth/strategies/standard';


const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/users',
    options: {
      description: 'Retreive list of all users',
      validate: { query },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } } } = request;

      const users = await Users.get(knex, { where: { deletedAt: null } });

      return Promise.all(users.map(Users.serialise));
    },
  },

  {
    method: 'GET',
    path: '/users/me',
    options: {
      description: 'Retrieve own user details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-own:read'],
        },
      },
      validate: {
        query,
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { user } = Credentials.fromRequest(request);

      return Users.serialise(user);
    },
  },
];

export default routes;
