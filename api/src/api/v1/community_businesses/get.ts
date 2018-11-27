import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { pick } from 'ramda';
import { CommunityBusinesses, CommunityBusiness } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import { GetCommunityBusinessRequest, GetCommunityBusinessesRequest } from '../types';
import { query, response } from './schema';
import { is360GivingId } from '../prerequisites/get_community_business';

export default [
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
    handler: async (request: GetCommunityBusinessesRequest, h: Hapi.ResponseToolkit) => {
      const {
        pre: { isChild },
        server: { app: { knex } },
        query,
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this organisations');
      }

      return CommunityBusinesses.get(knex, query);
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me',
    options: {
      description: 'Retrieve information about users own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-own:read', 'organisations_details-parent:read'],
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
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { communityBusiness } = request.pre;

      return CommunityBusinesses.serialise(<CommunityBusiness> communityBusiness);
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
    handler: async (request: GetCommunityBusinessRequest, h: Hapi.ResponseToolkit) => {
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
      return CommunityBusinesses.serialise(<CommunityBusiness> communityBusiness);
    },
  },
] as Hapi.ServerRoute[];
