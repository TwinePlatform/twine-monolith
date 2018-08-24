import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { CommunityBusinesses } from '../../../models';
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
    path: '/community-businesses/me/feedback',
    options: {
      description: 'Send feedback for one organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_feedback-own:write'],
        },
      },
      validate: {
        payload: {
          feedbackScore: Joi.number().integer().only([-1, 0, 1]),
        },
      },
      response: { schema: response },
    },
    handler: async (request: PostFeedbackRequest, h: Hapi.ResponseToolkit) => {
      const { knex } = request.server.app;
      const { feedbackScore } = request.payload;
      const { id } = request.auth.credentials.organisation;

      const communityBusiness = await CommunityBusinesses.getOne(knex, { where: { id } });

      return CommunityBusinesses.addFeedback(knex, communityBusiness, feedbackScore);
    },
  },

] as Hapi.ServerRoute[];
