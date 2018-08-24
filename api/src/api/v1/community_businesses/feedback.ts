import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { CommunityBusinesses, CommunityBusiness } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import { PostFeedbackRequest } from '../types';
import { response, since, until } from './schema';


export default [
  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/feedback',
    options: {
      description: 'Retrieve information about a specific community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_feedback-child:read', 'organisations_feedback-own:read'],
        },
      },
      validate: { query: { since, until } },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return Boom.notFound('Not implemented');
    },
  },

  {
    method: 'POST',
    path: '/community-businesses/{organisationId}/feedback',
    options: {
      description: 'Send feedback for one organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_feedback-child:write'],
        },
      },
      validate: {
        payload: {
          feedbackScore: Joi.number().integer().only([-1, 0, 1]),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild', failAction: 'error' },
      ],
    },
    handler: async (request: PostFeedbackRequest, h: Hapi.ResponseToolkit) => {
      const { communityBusiness, isChild } = request.pre;
      const { knex } = request.server.app;
      const { feedbackScore } = request.payload;

      if (! isChild) {
        return Boom.forbidden('Insufficient permissions to perform this action');
      }

      return CommunityBusinesses.addFeedback(
        knex,
        <CommunityBusiness> communityBusiness,
        feedbackScore
      );
    },
  },

] as Hapi.ServerRoute[];
