/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import * as Hapi from 'hapi';
import { Users } from '../../../models';
import schema from './schema';

export default [
  {
    method: 'GET',
    path: '/users',
    options: {
      description: 'Retreive list of all users',
      validation: schema,
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex } = request;

      const users = await Users.get(knex);

      return users.map(Users.serialise);
    },
  },
];
