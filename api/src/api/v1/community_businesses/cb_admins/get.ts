import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { CbAdmins } from '../../../../models';
import { response } from '../../users/schema';
import { id } from '../schema';
import { getCommunityBusiness, isChildOrganisation } from '../../prerequisites';


const routes: Hapi.ServerRoute[] = [
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
        { method: isChildOrganisation, assign: 'isChild' },
      ],
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const admins = await CbAdmins.fromOrganisation(knex, communityBusiness);

      return {
        result: await Promise.all(admins.map(CbAdmins.serialise)),
        meta: { total: admins.length },
      };
    },
  },
];


export default routes;
