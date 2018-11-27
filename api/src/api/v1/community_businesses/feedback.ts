import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { CommunityBusinesses, CommunityBusiness } from '../../../models';
import { GetFeedbackRequest, PostFeedbackRequest } from '../types';
import { query, response, since, until } from './schema';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';


export default [
  {
    method: 'GET',
    path: '/community-businesses/me/feedback',
    options: {
      description: 'Retrieve information about own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_feedback-own:read'],
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
    handler: async (request: GetFeedbackRequest, h: Hapi.ResponseToolkit) => {
      const { pre: { communityBusiness }, query, server: { app: { knex } } } = request;

      const since = new Date(query.since);
      const until = new Date(query.until);

      return CommunityBusinesses.getFeedback(
        knex,
        <CommunityBusiness> communityBusiness,
        { since, until, limit: query.limit, offset: query.offset }
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
    handler: async (request: GetFeedbackRequest, h: Hapi.ResponseToolkit) => {
      const { pre: { communityBusiness, isChild }, query, server: { app: { knex } } } = request;

      if (!isChild) {
        return Boom.forbidden('Cannot access this organisation');
      }

      const since = new Date(query.since);
      const until = new Date(query.until);

      return CommunityBusinesses.getFeedback(
        knex,
        <CommunityBusiness> communityBusiness,
        { since, until, limit: query.limit, offset: query.offset }
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
    handler: async (request: PostFeedbackRequest, h: Hapi.ResponseToolkit) => {
      const { knex } = request.server.app;
      const { feedbackScore } = request.payload;
      const { id } = request.auth.credentials.organisation;

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
        strategy: 'standard',
        access: {
          scope: ['organisations_feedback-own:read'],
        },
      },
      validate: { query: { since, until, ...query } },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetFeedbackRequest, h: Hapi.ResponseToolkit) => {
      const { query, server: { app: { knex } } } = request;
      const communityBusiness = <CommunityBusiness> request.pre.communityBusiness;

      const since = new Date(query.since);
      const until = new Date(query.until);

      const res: { score: string, count: string }[] = await knex('visit_feedback')
        .select('score', knex.raw('count (*)'))
        .where({ organisation_id: communityBusiness.id })
        .whereBetween('created_at', [since, until])
        .groupBy('score');

      return res
        .reduce((acc: { [k: string]: number, totalFeedback: number }, row) => {
          acc[row.score] = Number(row.count);
          acc.totalFeedback = (acc.totalFeedback || 0) + Number(row.count);
          return acc;
        }, { totalFeedback: 0, '-1': 0, 0: 0, 1: 0 });
    },
  },

] as Hapi.ServerRoute[];
