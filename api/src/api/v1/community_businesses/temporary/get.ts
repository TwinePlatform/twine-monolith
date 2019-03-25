import * as Hapi from 'hapi';
import { isChildOrganisation } from '../../prerequisites';
import { response } from '../schema';
import { CommunityBusinesses } from '../../../../models';

export default [
  {
    method: 'GET',
    path: '/community-businesses/temporary',
    options: {
      description: 'Retrieve list of all temporary community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
      pre: [
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {

      const {
        server: { app: { knex } },
      } = request;

      return CommunityBusinesses.getTemporary(knex);
    },
  },

] as Hapi.ServerRoute[];
