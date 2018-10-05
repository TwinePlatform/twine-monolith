import * as Hapi from 'hapi';
import { CommunityBusinesses } from '../../../models';
import { response } from '../schema/response';


export default [
  {
    method: 'GET',
    path: '/regions/community-businesses',
    options: {
      description: 'Retreive list of regions with related community businesses',
      auth: false,
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } } } = request;

      return CommunityBusinesses.byRegion(knex, { where: { deletedAt: null } });
    },
  },
] as Hapi.ServerRoute[];
