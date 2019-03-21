import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { CommunityBusinesses, CbAdmins } from '../../../../models';
import { isChildOrganisation } from '../../prerequisites';
import { RegisterCommunityBusinessesRequest } from '../../types';
import { response, cbPayload } from '../schema';

export default [
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
    handler: async (request: RegisterCommunityBusinessesRequest, h: Hapi.ResponseToolkit) => {
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
] as Hapi.ServerRoute[];
