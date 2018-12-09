import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { omit } from 'ramda';
import { response, id, meOrId, since, until, startedAt } from './schema';
import Roles from '../../../auth/roles';
import { RoleEnum } from '../../../auth/types';
import { VolunteerLogs, Duration, Volunteers, VolunteerLog } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import {
  PostMyVolunteerLogsRequest,
  SyncMyVolunteerLogsRequest,
  GetMyVolunteerLogsRequest,
  GetVolunteerLogRequest,
  PutMyVolunteerLogRequest,
  GetVolunteerLogSummaryRequest,
} from '../types';
import { requestQueryToModelQuery } from '../utils';
import { query } from '../users/schema';
import { StandardCredentials } from '../../../auth/strategies/standard';


const routes: Hapi.ServerRoute[] = [

  {
    method: 'GET',
    path: '/community-businesses/me/volunteer-logs',
    options: {
      description: 'Retrieve volunteer logs for own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-sibling:read', 'volunteer_logs-child:read'],
        },
      },
      validate: {
        query: {
          ...query,
          ...{ since, until: Joi.date().iso().greater(Joi.ref('since')) }, },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetMyVolunteerLogsRequest, h) => {
      const {
        server: { app: { knex } },
        query: _query,
        pre: { communityBusiness },
      } = request;

      const since = new Date(_query.since);
      const until = _query.until ? new Date(_query.until) : undefined;

      const query = {
        ...requestQueryToModelQuery<VolunteerLog>(_query),
        ...{ since, until },
      };

      const logs =
        await VolunteerLogs.fromCommunityBusiness(knex, communityBusiness, query);

      return Promise.all(logs.map(VolunteerLogs.serialise));
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me/volunteer-logs/{logId}',
    options: {
      description: 'Retrieve volunteer logs for own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-sibling:read', 'volunteer_logs-child:read'],
        },
      },
      validate: { query: { since, until } },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetVolunteerLogRequest, h) => {
      const {
        server: { app: { knex } },
        params: { logId },
        pre: { communityBusiness },
      } = request;

      const log = await VolunteerLogs.getOne(
        knex,
        {
          where: {
            id: Number(logId),
            organisationId: communityBusiness.id,
            deletedAt: null,
          },
        }
      );

      if (!log) {
        return Boom.notFound(`No log with ID: ${logId} found`);
      }

      return VolunteerLogs.serialise(log);
    },
  },

  {
    method: 'PUT',
    path: '/community-businesses/me/volunteer-logs/{logId}',
    options: {
      description: 'Update volunteer logs for own community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-sibling:write', 'volunteer_logs-child:write'],
        },
      },
      validate: {
        params: { logId: id },
        payload: {
          activity: Joi.string(),
          duration: Joi.object({
            hours: Joi.number().integer().min(0),
            minutes: Joi.number().integer().min(0),
            seconds: Joi.number().integer().min(0),
          }),
          startedAt,
          project: Joi.alt().try(Joi.string().min(2), Joi.only(null)),
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
        params: { logId },
        payload,
        pre: { communityBusiness },
      } = request;

      const log = await VolunteerLogs.getOne(
        knex,
        { where: { id: Number(logId), organisationId: communityBusiness.id } }
      );

      if (!log) {
        return Boom.notFound(`No log with ID: ${logId} found`);
      }

      const updatedLog = await VolunteerLogs.update(knex, log, payload);

      return VolunteerLogs.serialise(updatedLog);
    },
  },

  {
    method: 'DELETE',
    path: '/community-businesses/me/volunteer-logs/{logId}',
    options: {
      description: 'Mark volunteer logs for own community business as deleted',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-sibling:delete', 'volunteer_logs-child:delete'],
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
    handler: async (request: GetVolunteerLogRequest, h) => {
      const {
        server: { app: { knex } },
        params: { logId },
        pre: { communityBusiness },
      } = request;

      const log = await VolunteerLogs.destroy(
        knex,
        { id: Number(logId), organisationId: communityBusiness.id }
      );

      if (log === 0) {
        return Boom.notFound(`No log with ID: ${logId} found`);
      }

      return null;
    },
  },

  {
    method: 'POST',
    path: '/community-businesses/me/volunteer-logs',
    options: {
      description: 'Create volunteer log for own user',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'volunteer_logs-child:write',
            'volunteer_logs-sibling:write',
            'volunteer_logs-own:write',
          ],
        },
      },
      validate: {
        payload: {
          userId: id.default('me'),
          activity: Joi.string().required(),
          duration: Joi.object({
            hours: Joi.number().integer().min(0),
            minutes: Joi.number().integer().min(0),
            seconds: Joi.number().integer().min(0),
          }).required(),
          startedAt: startedAt.default(() => new Date(), 'now'),
          project: Joi.string().min(2),
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
        pre: { communityBusiness },
        payload,
      } = request;

      const { user, scope } = StandardCredentials.fromRequest(request);

      if (payload.userId !== 'me') {
        // if userId is specified, check request user has correct permissions
        const isTargetVolunteer = await Roles.userHas(knex, {
          userId: payload.userId,
          organisationId: communityBusiness.id,
          role: [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
        });

        const hasPermission =
          scope.includes('volunteer_logs-child:write') ||
          scope.includes('volunteer_logs-sibling:write');

        // To continue, userId must correspond to VOLUNTEER/VOLUNTEER_ADMIN
        if (!isTargetVolunteer) {
          return Boom.badRequest('User ID does not correspond to a volunteer');
        }

        if (!hasPermission) {
          return Boom.forbidden('Insufficient permission');
        }
      }

      try {
        const log = await VolunteerLogs.add(knex, {
          ...payload,
          userId: payload.userId === 'me' ? user.id : payload.userId,
          organisationId: communityBusiness.id,
        });

        return VolunteerLogs.serialise(log);

      } catch (error) {
        if (error.code === '23502') { // Violation of null constraint implies invalid activity
          return Boom.badRequest('Invalid activity or project');
        }
        throw error;
      }
    },
  },

  {
    method: 'POST',
    path: '/community-businesses/me/volunteer-logs/sync',
    options: {
      description: 'Synchronise volunteer logs for own use at community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-own:write', 'volunteer_logs-sibling:write'],
        },
      },
      validate: {
        payload: Joi.array().items(Joi.object({
          id,
          userId: meOrId.default('me'),
          activity: Joi.string().required(),
          duration: Joi.object({
            hours: Joi.number().integer().min(0),
            minutes: Joi.number().integer().min(0),
            seconds: Joi.number().integer().min(0),
          }).required(),
          startedAt: startedAt.default(() => new Date(), 'now'),
          deletedAt: Joi.alt().try(Joi.date().iso().max('now'), Joi.only(null)),
          project: Joi.alt().try(Joi.string().min(2), Joi.only(null)),
        })).required(),
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: SyncMyVolunteerLogsRequest, h) => {
      const {
        server: { app: { knex } },
        pre: { communityBusiness },
        payload,
      } = request;

      const { user, scope } = StandardCredentials.fromRequest(request);

      if (
        payload.some((log) => log.userId !== 'me') && // If some logs correspond to other users
        !scope.includes('volunteer_logs-sibling:write') // And client doesn't have the sibling scope
      ) {
        return Boom.forbidden('Insufficient scope'); // Then 403
      }

      const targetUserChecks = payload
        .filter((l) => l.userId !== 'me')
        .map((l) =>
          Roles.userHas(
            knex,
            {
              userId: Number(l.userId),
              organisationId: communityBusiness.id,
              role: [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
            }
          )
        );

      const areVolunteers = await Promise.all(targetUserChecks);

      if (!areVolunteers.every((a) => a)) {
        return Boom.badRequest('Some users are not volunteers');
      }

      try {
        await knex.transaction(async (trx) =>
          Promise.all(payload.map(async (log) => {
            const existsInDB = log.hasOwnProperty('id');
            const shouldUpdate = existsInDB && !log.deletedAt;
            const shouldDelete = existsInDB && log.deletedAt;

            if (shouldUpdate) {

              return VolunteerLogs.update(trx,
                { id: log.id, organisationId: communityBusiness.id },
                {
                  ...omit(['id', 'deletedAt'], log),
                  organisationId: communityBusiness.id,
                  userId: log.userId === 'me' ? user.id : Number(log.userId),
                }
              );

            } else if (shouldDelete) {

              return VolunteerLogs.update(trx, { id: log.id }, { deletedAt: log.deletedAt });

            } else {
              // otherwise, add log to DB

              return VolunteerLogs.add(trx, {
                ...log,
                organisationId: communityBusiness.id,
                userId: log.userId === 'me' ? user.id : Number(log.userId),
              });

            }
          }))
        );

        return null;

      } catch (error) {
        if (error.code === '23502') { // Violation of null constraint implies invalid activity
          return Boom.badRequest('Invalid activity or project');
        }
        if (error.code === '23505') { // Violation of unique constraint => duplicate log
          return Boom.badRequest('Duplicate logs in payload, check start times');
        }
        throw error;
      }
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me/volunteer-logs/summary',
    options: {
      description: 'Retreive summary of volunteer statistics from own organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: [
            'organisations_details-parent:read',
            'organisations_details-own:read',
          ],
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
    handler: async (request: GetVolunteerLogSummaryRequest, h) => {
      const {
        server: { app: { knex } },
        pre: { communityBusiness },
        query,
      } = request;

      const since = new Date(query.since);
      const until = new Date(query.until);

      const logs = await VolunteerLogs.get(
        knex,
        {
          fields: ['duration'],
          where: { organisationId: communityBusiness.id },
          whereBetween: since || until
            ? {
              startedAt: [
                since || new Date(0),
                until || new Date(),
              ],
            }
            : undefined,
        }
      );

      const total = logs.reduce((acc, log) =>
        Duration.sum(acc, log.duration), Duration.fromSeconds(0));

      const volunteers = await Volunteers.fromCommunityBusiness(knex, communityBusiness);

      return {
        volunteers: volunteers.length,
        volunteeredTime: total,
      };
    },
  },
];

export default routes;
