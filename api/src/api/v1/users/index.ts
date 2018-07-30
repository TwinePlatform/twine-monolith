/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import * as Hapi from 'hapi';
import { Dictionary } from 'ramda';
import { Users } from '../../../models';
import { query, response } from './schema';
import { Response } from '../schema/response';


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

      return users.map(Users.serialise);
    },
  },
];
