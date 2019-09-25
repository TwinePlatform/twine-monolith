import * as Boom from '@hapi/boom';
import { CommunityBusinesses, CbAdmins } from '../../../../models';
import { isChildOrganisation } from '../../prerequisites';
import { Api } from '../../types/api';
import { response, cbPayload } from '../schema';


const routes: [Api.CommunityBusinesses.Register.Temporary.POST.Route] = [
  {
    method: 'POST',
    path: '/community-businesses/register/temporary',
    options: {
      description: 'Register a temporary community businesses and admin user for onboarding',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:write'],
        },
      },
      validate: {
        payload: {
          orgName: cbPayload.name.required(),
        },
      },
      pre: [
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
      response: { schema: response },
    },
    handler: async (request, h) => {
      const {
        pre: { isChild },
        server: { app: { knex } },
        payload: { orgName },
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to create organisations');
      }

      // Create accounts
      const { admin, cb } = await knex.transaction(async (trx) => {
        const cb = await CommunityBusinesses.addTemporary(trx, `TEMPORARY ACCOUNT: ${orgName}`);
        const admin = await CbAdmins.addTemporaryWithRole(trx, cb);
        return { admin, cb };
      });

      return {
        communityBusiness: cb,
        cbAdmin: admin,
      };
    },
  },
];

export default routes;
