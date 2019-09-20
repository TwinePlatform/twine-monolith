import * as Boom from '@hapi/boom';
import { pick } from 'ramda';
import { CommunityBusinesses } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import { Api } from '../types/api';
import { query, response } from './schema';
import { is360GivingId } from '../prerequisites/get_community_business';


const routes: [
  Api.CommunityBusinesses.GET.Route,
  Api.CommunityBusinesses.Me.GET.Route,
  Api.CommunityBusinesses.Id.GET.Route
] = [
  {
    method: 'GET',
    path: '/community-businesses',
    options: {
      description: 'Retrieve a list of all community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
      validate: {
        query,
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
        query,
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this organisations');
      }

      const cbs = await CommunityBusinesses.get(knex, query);
      return Promise.all(cbs.map(CommunityBusinesses.serialise));
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me',
    options: {
      description: 'Retrieve information about users own community business',
      auth: {
        strategies: ['standard', 'external'],
        access: {
          scope: [
            'organisations_details-own:read',
            'organisations_details-parent:read',
            'api:visitor:read',
          ],
        },
      },
      validate: {
        query,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      return CommunityBusinesses.serialise(request.pre.communityBusiness);
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/{organisationId}',
    options: {
      description: 'Retrieve information about users own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
      validate: {
        query,
      },
      response: { schema: response },
      pre: [
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
    },
    handler: async (request, h) => {
      const {
        pre: { isChild },
        params: { organisationId },
        query: _query,
        server: { app: { knex } } } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this organisation');
      }

      const idQuery = (is360GivingId(organisationId))
        ? { _360GivingId: organisationId }
        : { id: Number(organisationId) };

      const query = {
        ...pick(['fields'], _query),
        ...{ where: idQuery },
      };

      const communityBusiness = await CommunityBusinesses.getOne(knex, query);

      if (!communityBusiness) {
        return Boom.notFound(`No community business with the id: ${organisationId}`);
      }

      return CommunityBusinesses.serialise(communityBusiness);
    },
  },
];

export default routes;
