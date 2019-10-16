import { CommunityBusinesses, CbAdmins } from '../../../../models';
import { requireChildOrganisation } from '../../prerequisites';
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
      pre: [requireChildOrganisation],
      response: { schema: response },
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        payload: { orgName },
      } = request;

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
