import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { pick, map } from 'ramda';
import { CommunityBusinesses } from '../../../models';
import { response } from '../schema/response';
import { id } from '../schema/request';


export default [
  {
    method: 'GET',
    path: '/regions/{regionId}/community-businesses',
    options: {
      description: 'Retreive list of regions with related community businesses',
      auth: false,
      validate: {
        params: { regionId: id },
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, params: { regionId } } = request;

      const [{ regionName } = { regionName: null }] = await knex('community_business_region')
        .select({ regionName: 'region_name' })
        .where({ community_business_region_id: regionId })
        .limit(1);

      if (!regionName) { return Boom.notFound('Region cannot be found'); }

      const cbsInRegion = await CommunityBusinesses.get(knex, {
        where: {
          region: regionName,
          deletedAt: null,
        },
        order: ['organisation_name', 'asc'],
      });

      return map(pick(['id', 'name']), cbsInRegion);
    },
  },
] as Hapi.ServerRoute[];
