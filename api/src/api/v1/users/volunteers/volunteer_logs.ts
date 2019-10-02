import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { Duration } from 'twine-util';
import { response, since, until, query, id, startedAt } from '../schema';
import { VolunteerLogs } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';
import { Api } from '../../types/api';
import { Credentials as StandardCredentials } from '../../../../auth/strategies/standard';
import {
  volunteerProject,
  volunteerLogActivity,
  volunteerLogDuration
} from '../../community_businesses/schema';
import { Serialisers } from '../../serialisers';


const routes: [
  Api.Users.Volunteers.Me.VolunteerLogs.GET.Route,
  Api.Users.Volunteers.Me.VolunteerLogs.Id.GET.Route,
  Api.Users.Volunteers.Me.VolunteerLogs.Id.PUT.Route,
  Api.Users.Volunteers.Me.VolunteerLogs.Id.DELETE.Route,
  Api.Users.Volunteers.Me.VolunteerLogs.Summary.GET.Route
] = [

  {
    method: 'GET',
    path: '/users/volunteers/me/volunteer-logs',
    options: {
      description: 'Read own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-own:read'],
        },
      },
      validate: {
        query: { since, until: Joi.date().iso().greater(Joi.ref('since')), ...query },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        pre: { communityBusiness },
        query,
      } = request;

      const { user } = StandardCredentials.fromRequest(request);

      const since = new Date(query.since);
      const until = query.until ? new Date(query.until) : undefined;

      const logs = await VolunteerLogs.fromUserAtCommunityBusiness(
        knex,
        user,
        communityBusiness,
        { since, until, limit: Number(query.limit), offset: Number(query.offset) }
      );

      return Promise.all(logs.map(Serialisers.volunteerLog));
    },
  },

  {
    method: 'GET',
    path: '/users/volunteers/me/volunteer-logs/{logId}',
    options: {
      description: 'Read own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-own:read'],
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
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        pre: { communityBusiness },
        params: { logId },
        query,
      } = request;

      const { user } = StandardCredentials.fromRequest(request);

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
        : Serialisers.volunteerLog(log);
    },
  },

  {
    method: 'PUT',
    path: '/users/volunteers/me/volunteer-logs/{logId}',
    options: {
      description: 'Update own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-own:write'],
        },
      },
      validate:  {
        params: { logId: id },
        payload: {
          activity: volunteerLogActivity,
          duration: volunteerLogDuration,
          startedAt,
          project: volunteerProject.allow(null),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        payload,
        pre: { communityBusiness },
        params: { logId },
      } = request;

      const { user } = StandardCredentials.fromRequest(request);

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

      return Serialisers.volunteerLog(updatedLog);
    },
  },

  {
    method: 'DELETE',
    path: '/users/volunteers/me/volunteer-logs/{logId}',
    options: {
      description: 'Delete own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-own:write'],
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
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        pre: { communityBusiness },
        params: { logId },
      } = request;

      const { user } = StandardCredentials.fromRequest(request);

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

  {
    method: 'GET',
    path: '/users/volunteers/me/volunteer-logs/summary',
    options: {
      description: 'Read own volunteer logs summary',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-own:read'],
        },
      },
      validate: {
        query: { since, until },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        pre: { communityBusiness },
        query,
      } = request;

      const { user } = StandardCredentials.fromRequest(request);
      const since = new Date(query.since);
      const until = new Date(query.until);

      const logs = await VolunteerLogs.fromUserAtCommunityBusiness(
        knex,
        user,
        communityBusiness,
        { since, until }
      );

      const total = logs.reduce((acc, log) =>
        Duration.sum(acc, log.duration), Duration.fromSeconds(0));

      return { total };
    },
  },

];

export default routes;
