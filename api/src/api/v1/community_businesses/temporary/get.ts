import { isChildOrganisation } from '../../prerequisites';
import { response } from '../schema';
import { CommunityBusinesses } from '../../../../models';
import { Api } from '../../types/api';


const routes: [Api.CommunityBusinesses.Temporary.GET.Route] = [
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
    handler: async (request, h) => {
      const { server: { app: { knex } } } = request;

      return CommunityBusinesses.getTemporary(knex);
    },
  },
];

export default routes;
