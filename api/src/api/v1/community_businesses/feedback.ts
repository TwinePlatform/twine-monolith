import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { CommunityBusinesses } from '../../../models';
import { Api } from '../types/api';
import { query, response, since, until } from './schema';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Feedback } from '../../../models/types';


const routes: [
  Api.CommunityBusinesses.Me.Feedback.GET.Route,
  Api.CommunityBusinesses.Id.Feedback.GET.Route,
  Api.CommunityBusinesses.Me.Feedback.POST.Route,
  Api.CommunityBusinesses.Me.Feedback.Aggregates.GET.Route
] = [
  {
    method: 'GET',
    path: '/community-businesses/me/feedback',
    options: {
      description: 'Retrieve information about own community business',
      auth: {
        strategies: ['standard', 'external'],
        access: {
          scope: ['organisations_feedback-own:read', 'api:visitor:read'],
        },
      },
      validate: {
        query: { since, until, ...query },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const { pre: { communityBusiness }, query, server: { app: { knex } } } = request;

      const since = new Date(query.since);
      const until = new Date(query.until);

      return CommunityBusinesses.getFeedback(
        knex,
        communityBusiness,
        { since, until, limit: Number(query.limit), offset: Number(query.offset) }
      );
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/feedback',
    options: {
      description: 'Retrieve information about a specific community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_feedback-child:read'],
        },
      },
      validate: {
        query: { since, until },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
        { method: isChildOrganisation , assign: 'isChild' },
      ],
    },
    handler: async (request, h) => {
      const { pre: { communityBusiness, isChild }, query, server: { app: { knex } } } = request;

      if (!isChild) {
        return Boom.forbidden('Cannot access this organisation');
      }

      const since = new Date(query.since);
      const until = new Date(query.until);

      return CommunityBusinesses.getFeedback(
        knex,
        communityBusiness,
        { since, until, limit: Number(query.limit), offset: Number(query.offset) }
      );
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
    handler: async (request, h) => {
      const { knex } = request.server.app;
      const { feedbackScore } = request.payload;
      const { organisation: { id } } = StandardCredentials.fromRequest(request);

      const communityBusiness = await CommunityBusinesses.getOne(knex, { where: { id } });

      return CommunityBusinesses.addFeedback(knex, communityBusiness, feedbackScore);
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me/feedback/aggregates',
    options: {
      description: 'Retrieve information about own community business',
      auth: {
        strategies: ['standard', 'external'],
        access: {
          scope: ['organisations_feedback-own:read', 'api:visitor:read'],
        },
      },
      validate: { query: { since, until, ...query } },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const { query, server: { app: { knex } } } = request;
      const { communityBusiness } = request.pre;

      const since = new Date(query.since);
      const until = new Date(query.until);

      const res: { score: Feedback['score']; count: string }[] = await knex('visit_feedback')
        .select('score', knex.raw('count (*)'))
        .where({ organisation_id: communityBusiness.id })
        .whereBetween('created_at', [since, until])
        .groupBy('score');

      return res
        .reduce((acc: { '-1': number; '0': number; '1': number; totalFeedback: number }, row) => {
          acc[row.score] = Number(row.count);
          acc.totalFeedback = (acc.totalFeedback || 0) + Number(row.count);
          return acc;
        }, { totalFeedback: 0, '-1': 0, 0: 0, 1: 0 });
    },
  },

];

export default routes;
