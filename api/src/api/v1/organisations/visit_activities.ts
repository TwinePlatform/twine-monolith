import * as Hapi from 'hapi';
import { CommunityBusiness, CommunityBusinesses } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { query, response } from './schema';


export default [
  {
    method: 'GET',
    path: '/community-businesses/{communityBusinessId}/visit_activities',
    options: {
      description: 'Retrieve all visit activities for a community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'visit_activities-own:read',
            'visit_activities-child:read',
            'visit_activties-parent:read',
          ],
        },
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
      validate: { query },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex, pre: { communityBusiness } } = request;
      return CommunityBusinesses.getVisitActivities(knex, communityBusiness);
    },
  },
];
