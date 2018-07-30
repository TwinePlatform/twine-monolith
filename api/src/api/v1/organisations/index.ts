/*
 * Twine API v1 /organisations
 *
 * See also:
 * - /api/v1/api.json
 */
import * as Hapi from 'hapi';
import { Dictionary } from 'ramda';
import { Organisations } from '../../../models';
import { query, response } from './schema';
import { Response } from '../schema/response';


export default [
  {
    method: 'GET',
    path: '/organisations',
    options: {
      description: 'Retreive list of all organisations',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
      validate: { query },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex } = request;

      const org = await Organisations.get(knex);

      return org.map(Organisations.serialise);
    },
  },
];
