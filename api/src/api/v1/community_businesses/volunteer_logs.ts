import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { omit } from 'ramda';
import { Duration, Promises } from 'twine-util';
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
import * as Scopes from '../../../auth/scopes';
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
import { RoleEnum } from '../../../models/types';


const ignoreInvalidLogs = (logs: SyncMyVolunteerLogsRequest['payload']) => {
  const schema = Joi.object({
    startedAt,
    deletedAt: Joi.alt().try(Joi.date().iso().max('now'), Joi.only(null)),
  });

  return logs
    // Ignore invalid date strings for startedAt and deletedAt
    .filter((log) => {
      const result = Joi.validate({ startedAt: log.startedAt, deletedAt: log.deletedAt }, schema);
      return !result.error;
    });
};


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
          startedAt: startedAt.default(() => new Date(), 'now'),
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

      const { user, scope } = StandardCredentials.fromRequest(request);
      const stats = { ignored: 0, synced: 0 };

      // Ignore invalid logs silently because of
      // https://github.com/TwinePlatform/twine-monolith/issues/246
      const payload = ignoreInvalidLogs(_payload);

      if (payload.length !== _payload.length) {
        // Do not await - this is an auxiliary action
        VolunteerLogs.recordInvalidLog(knex, user, communityBusiness, _payload);
        stats.ignored = _payload.length - payload.length;
      }

      if (
        // If some logs correspond to other users...
        payload.some((log) => log.userId !== 'me') &&
        // ...and we don't have permission to write to other users
        !Scopes.intersect(['volunteer_logs-sibling:write', 'volunteer_logs-child:write'], scope)
      ) {
        // Then 403
        return Boom.forbidden('Insufficient scope: cannot write other users logs');
      }

      const targetUserChecks = payload
        .filter((l) => l.userId !== 'me')
        .map((l) =>
          Roles.userHasAtCb(
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
        const results = await Promises.some(payload.map(async (log) => {
          const existsInDB = log.hasOwnProperty('id');
          const shouldUpdate = existsInDB && !log.deletedAt;
          const shouldDelete = existsInDB && log.deletedAt;

          if (shouldUpdate) {

            return VolunteerLogs.update(knex,
              { id: log.id, organisationId: communityBusiness.id },
              {
                ...omit(['id', 'deletedAt'], log),
                organisationId: communityBusiness.id,
                userId: log.userId === 'me' ? user.id : Number(log.userId),
              }
            );

          } else if (shouldDelete) {

            return VolunteerLogs.update(knex, { id: log.id }, { deletedAt: log.deletedAt });

          } else {
            // otherwise, add log to DB

            return VolunteerLogs.add(knex, {
              ...log,
              createdBy: user.id,
              organisationId: communityBusiness.id,
              userId: log.userId === 'me' ? user.id : Number(log.userId),
            });

          }
        }));

        return results.reduce((acc, result) => {
          if (result instanceof Error) {
            acc.ignored = acc.ignored + 1;
          } else {
            acc.synced = acc.synced + 1;
          }
          return acc;
        }, stats);

      } catch (error) {
        console.log(error);

        return stats;
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
