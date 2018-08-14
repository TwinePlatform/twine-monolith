import * as Hapi from 'hapi';
import { Users } from '../../../models';
import { query, response } from './schema';


export default [
  {
    method: 'GET',
    path: '/users',
    options: {
      description: 'Retreive list of all users',
      validate: { query },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex } = request;

      const users = await Users.get(knex, { where: { deletedAt: null } });

      return Promise.all(users.map(Users.serialise));
    },
  },
];
