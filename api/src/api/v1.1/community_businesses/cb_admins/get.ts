import { CbAdmins } from '../../../../models';
import { response } from '../../users/schema';
import { id } from '../schema';
import { getCommunityBusiness, requireChildOrganisation } from '../../prerequisites';
import { Api } from '../../types/api';
import { Serialisers } from '../../serialisers';


const routes: [Api.CommunityBusinesses.CbAdmins.GET.Route] = [
  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/cb-admins',
    options: {
      description: 'Retreive list of all cb-admins at an organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:read'],
        },
      },
      validate: {
        params: { organisationId: id },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: requireChildOrganisation },
      ],
    },
    handler: async (request, h) => {
      const { pre: { communityBusiness }, server: { app: { knex } } } = request;

      const admins = await CbAdmins.fromOrganisation(knex, communityBusiness);

      return {
        result: await Promise.all(admins.map(Serialisers.users.noSecrets)),
        meta: { total: admins.length },
      }
    },
  },
];

export default routes;
