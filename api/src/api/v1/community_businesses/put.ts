import * as Boom from '@hapi/boom';
import { CommunityBusinesses } from '../../../models';
import { getCommunityBusiness, requireChildOrganisation } from '../prerequisites';
import { Api } from '../types/api';
import { id, response, cbPayload } from './schema';
import { Serialisers } from '../serialisers';


const routes: [
  Api.CommunityBusinesses.Me.PUT.Route,
  Api.CommunityBusinesses.Id.PUT.Route
] = [
  {
    method: 'PUT',
    path: '/community-businesses/me',
    options: {
      description: 'Update own community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-own:write'],
        },
      },
      validate: {
        payload: cbPayload,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const { payload: changeSet, pre: { communityBusiness }, server: { app: { knex } } } = request;

      if (communityBusiness.isTemp) {
        return Boom.forbidden('Temporary organisation');
      }

      try {
        const cb = await CommunityBusinesses.update(knex, communityBusiness, changeSet);
        return Serialisers.communityBusiness(cb);

      } catch (error) {
        // Intercept subset of class 23 postgres error codes thrown by `knex`
        // Class 23 corresponds to integrity constrain violation
        // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
        // Happens, for e.g., if try to set a sector or region that doesn't exist
        // TODO:
        // Handle this better, preferably without having to perform additional check
        // queries. See https://github.com/TwinePlatform/twine-api/issues/147
        if (error.code && error.code.includes('235')) {
          return Boom.badRequest();
        } else {
          throw error;
        }
      }

    },
  },

  {
    method: 'PUT',
    path: '/community-businesses/{organisationId}',
    options: {
      description: 'Update community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:write'],
        },
      },
      validate: {
        params: {
          organisationId: id,
        },
        payload: cbPayload,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        requireChildOrganisation,
      ],
    },
    handler: async (request, h) => {
      const { payload: changeSet, pre: { communityBusiness }, server: { app: { knex } } } = request;

      if (communityBusiness.isTemp) {
        return Boom.forbidden('Temporary organisation');
      }

      try {
        const cb = await CommunityBusinesses.update(knex, communityBusiness, changeSet);
        return Serialisers.communityBusiness(cb);

      } catch (error) {
        // Intercept subset of class 23 postgres error codes thrown by `knex`
        // Class 23 corresponds to integrity constrain violation
        // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
        // Happens, for e.g., if try to set a sector or region that doesn't exist
        // TODO:
        // Handle this better, preferably without having to perform additional check
        // queries. See https://github.com/TwinePlatform/twine-api/issues/147
        if (error.code.includes('235')) {
          return Boom.badRequest();
        }
      }

    },
  },
];

export default routes;
