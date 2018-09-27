import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { CommunityBusinesses, CommunityBusiness } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import { GetCommunityBusinessRequest } from '../types';
import { query, response } from './schema';


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
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return Boom.notFound('Not implemented');
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
        failAction: (request, h, err) => err,
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
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
    },
    handler: async (request: GetCommunityBusinessRequest, h: Hapi.ResponseToolkit) => {
      const { communityBusiness, isChild } = request.pre;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this organisation');
      }

      return CommunityBusinesses.serialise(<CommunityBusiness> communityBusiness);
    },
  },
] as Hapi.ServerRoute[];
