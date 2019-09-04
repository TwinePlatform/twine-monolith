import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { Duration } from 'twine-util';
import { silent } from 'twine-util/promises';
import {
  response,
  id,
  meOrId,
  since,
  until,
  startedAt,
  volunteerLogActivity,
  volunteerLogDuration,
  volunteerProject
} from './schema';
import Roles from '../../../models/role';
import { VolunteerLogs, Volunteers, VolunteerLog } from '../../../models';
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
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { RoleEnum, User } from '../../../models/types';
import { Unpack } from '../../../types/internal';


const logDatesSchema = Joi.object({
  startedAt,
  deletedAt: Joi.alt().try(Joi.date().iso().max('now'), Joi.only(null)),
});

const ignoreInvalidLogs = (logs: SyncMyVolunteerLogsRequest['payload']) =>
// Ignore invalid date strings for startedAt and deletedAt
  logs
    .reduce((acc, log) => {
      const dates = { startedAt: log.startedAt, deletedAt: log.deletedAt };
      const result = Joi.validate(dates, logDatesSchema);
      if (result.error) {
        acc.invalid = acc.invalid.concat(log);
      } else {
        acc.valid = acc.valid.concat(log);
      }
      return acc;
    }, { valid: [] as typeof logs, invalid: [] as typeof logs });

const uniformLogs = (user: User) =>
  (log: Unpack<SyncMyVolunteerLogsRequest['payload']>): Partial<VolunteerLog> =>
    ({
      ...log,
      userId: log.userId === 'me' ? user.id : log.userId,
    });

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
          ...{ since, until: Joi.date().iso().greater(Joi.ref('since')) },
        },
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
          activity: volunteerLogActivity,
          duration: volunteerLogDuration,
          startedAt: Joi.date().iso().min(new Date(0)),
          project: volunteerProject.allow(null),
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
          activity: volunteerLogActivity.required(),
          duration: volunteerLogDuration.required(),
          startedAt: Joi.date().iso().min(new Date(0)).default(() => new Date(), 'now'),
          project: volunteerProject.allow(null),
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
        const isTargetVolunteer = await Roles.userHasAtCb(knex, {
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
      } else {
        const isVolunteer = await Roles.userHasAtCb(knex, {
          userId: user.id,
          organisationId: communityBusiness.id,
          role: [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
        });

        if (!isVolunteer) {
          return Boom.forbidden('Only volunteers may add logs');
        }
      }

      try {
        const log = await VolunteerLogs.add(knex, {
          ...payload,
          createdBy: user.id,
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
          scope: [
            'volunteer_logs-sibling:write',
            'volunteer_logs-child:write',
            'volunteer_logs-own:write',
          ],
        },
      },
      validate: {
        payload: Joi.array().items(Joi.object({
          id,
          userId: meOrId.default('me'),
          activity: volunteerLogActivity.required(),
          duration: volunteerLogDuration.required(),
          // TODO: Weak validation for "startedAt" required by
          // https://github.com/TwinePlatform/twine-monolith/issues/246
          // Once, resolved, replace with:
          // `startedAt.default(() => new Date(), 'now')`
          startedAt: Joi.string().default(() => new Date(), 'now'),
          // TODO: Weak validation for "deletedAt" required by
          // https://github.com/TwinePlatform/twine-monolith/issues/246
          // Once, resolved, replace with:
          // `Joi.alt().try(Joi.date().iso().max('now'), Joi.only(null))`
          deletedAt: Joi.alt().try(Joi.string(), Joi.only(null)),
          project: volunteerProject.allow(null),
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
        payload: _payload,
      } = request;

      const { user } = StandardCredentials.fromRequest(request);

      // Ignore invalid logs silently because of
      // https://github.com/TwinePlatform/twine-monolith/issues/246
      const { valid, invalid } = ignoreInvalidLogs(_payload);
      const payload = valid.map(uniformLogs(user));

      if (invalid.length > 0) {
        silent(VolunteerLogs.recordInvalidLog(knex, user, communityBusiness, invalid));
      }

      try {
        const result = await VolunteerLogs.syncLogs(knex, communityBusiness, user, payload);

        return {
          synced: result.synced,
          ignored: result.ignored + invalid.length,
        };

      } catch (error) {
        switch (error.message) {
          case 'Insufficient permissions to write other users logs':
            return Boom.forbidden(error.message);

          case 'Some users do not have permission to write volunteer logs':
            return Boom.badRequest(error.message);

          default:
            console.log(error);
            // We attempt not to respond with non-200 status code because of
            // how offline mode is written in the legacy volunteer app.
            // See https://github.com/TwinePlatform/twine-monolith/issues/246
            return { ignored: invalid.length + valid.length, synced: 0 };
        }
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
          whereBetween: { startedAt: [since, until] },
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
