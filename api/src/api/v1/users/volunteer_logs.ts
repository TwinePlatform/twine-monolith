import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import {
  response,
  since,
  until,
  query,
  id,
} from './schema';
import { VolunteerLogs } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import {
  GetMyVolunteerLogsRequest,
  PostMyVolunteerLogsRequest,
  GetVolunteerLogRequest,
  PutMyVolunteerLogRequest
} from '../types';


const routes: Hapi.ServerRoute[] = [

  {
    method: 'GET',
    path: '/users/me/volunteer-logs',
    options: {
      description: 'Read own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-parent:read'],
        },
      },
      validate: {
        query: { since, until, ...query },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetMyVolunteerLogsRequest, h) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        pre: { communityBusiness },
        query,
      } = request;

      const since = new Date(query.since);
      const until = new Date(query.until);

      const logs = await VolunteerLogs.fromUserAtCommunityBusiness(
        knex,
        user,
        communityBusiness,
        { since, until, limit: query.limit, offset: query.offset }
      );

      return Promise.all(logs.map(VolunteerLogs.serialise));
    },
  },

  {
    method: 'POST',
    path: '/users/me/volunteer-logs',
    options: {
      description: 'Create volunteer log for own user',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-parent:write'],
        },
      },
      validate: {
        payload: {
          organisationId: id,
          activity: Joi.string().required(),
          duration: Joi.object({
            hours: Joi.number().integer().min(0),
            minutes: Joi.number().integer().min(0),
            seconds: Joi.number().integer().min(0),
          }).required(),
          startedAt: Joi.date().iso().max('now').default(() => new Date().toISOString(), 'now'),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: PostMyVolunteerLogsRequest, h) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        pre: { communityBusiness },
        payload,
      } = request;

      if (payload.organisationId && communityBusiness.id !== payload.organisationId) {
        return Boom.badRequest('Cannot create log for different organisation');
      }

      try {
        const log = await VolunteerLogs.add(knex, {
          ...payload,
          organisationId: communityBusiness.id,
          userId: user.id,
        });

        return VolunteerLogs.serialise(log);

      } catch (error) {
        if (error.code === '23502') { // Violation of null constraint implies invalid activity
          return Boom.badRequest('Invalid activity');
        }
        throw error;
      }
    },
  },

  {
    method: 'GET',
    path: '/users/me/volunteer-logs/{logId}',
    options: {
      description: 'Read own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-parent:read'],
        },
      },
      validate: {
        query: { fields: query.fields },
        params: { logId: id },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetVolunteerLogRequest, h) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        pre: { communityBusiness },
        params: { logId },
        query,
      } = request;

      const log = await VolunteerLogs.getOne(
        knex,
        {
          where: {
            id: Number(logId),
            userId: user.id,
            organisationId: communityBusiness.id,
            deletedAt: null,
          },
          fields: query.fields,
        }
      );

      return !log
        ? Boom.notFound('No log with this id found under this account')
        : VolunteerLogs.serialise(log);
    },
  },

  {
    method: 'PUT',
    path: '/users/me/volunteer-logs/{logId}',
    options: {
      description: 'Delete own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-parent:write'],
        },
      },
      validate:  {
        params: { logId: id },
        payload: {
          activity: Joi.string(),
          duration: Joi.object({
            hours: Joi.number().integer().min(0),
            minutes: Joi.number().integer().min(0),
            seconds: Joi.number().integer().min(0),
          }),
          startedAt: Joi.date().iso().max('now'),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: PutMyVolunteerLogRequest, h) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        payload,
        pre: { communityBusiness },
        params: { logId },
      } = request;

      const log = await VolunteerLogs.getOne(knex, { where: {
        id: Number(logId),
        userId: user.id,
        organisationId: communityBusiness.id,
        deletedAt: null,
      }});

      if (!log) {
        return Boom.notFound('No log with this id found under this account');
      }

      const updatedLog = await VolunteerLogs.update(knex, log, { ...payload });

      return VolunteerLogs.serialise(updatedLog);
    },
  },

  {
    method: 'DELETE',
    path: '/users/me/volunteer-logs/{logId}',
    options: {
      description: 'Delete own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-parent:write'],
        },
      },
      validate: {
        params: { logId: id },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: PutMyVolunteerLogRequest, h) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        pre: { communityBusiness },
        params: { logId },
      } = request;

      const affectedRows = await VolunteerLogs.destroy(knex, {
        id: Number(logId),
        userId: user.id,
        organisationId: communityBusiness.id,
        deletedAt: null,
      });

      return affectedRows === 0
        ? Boom.notFound('No log with this id found under this account')
        : null;
    },
  },

];

export default routes;
