import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { Duration } from 'twine-util';
import { silent } from 'twine-util/promises';
import {
  response,
  id,
  userId,
  meOrId,
  since,
  until,
  startedAt,
  volunteerLogActivity,
  notes,
  volunteerLogDuration,
  volunteerProject
} from './schema';
import Roles from '../../../models/role';
import { VolunteerLogs, Volunteers, VolunteerLog, VolunteerLogPermissions } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { Api } from '../types/api';
import { requestQueryToModelQuery } from '../utils';
import { query } from '../users/schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { RoleEnum, User } from '../../../models/types';
import { Unpack } from '../../../types/internal';
import { Serialisers } from '../serialisers';
import { getCredentialsFromRequest } from '../auth';


type SyncLogPayload = Api.CommunityBusinesses.Me.VolunteerLogs.sync.POST2.Request['payload'];
type SyncLogPayloadItem = Unpack<SyncLogPayload>;


const logDatesSchema = Joi.object({
  startedAt,
  deletedAt: Joi.alt().try(Joi.date().iso().max('now'), Joi.only(null)),
});

const ignoreInvalidLogs = (logs: SyncLogPayload) =>
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

const uniformLogs = (user: User) => (log: SyncLogPayloadItem): Partial<VolunteerLog> =>
  ({
    ...log,
    userId: log.userId === 'me' ? user.id : log.userId,
  });

const routes: [
  Api.CommunityBusinesses.Me.VolunteerLogs.GET.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.Id.GET.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.Id.GET.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.Id.PUT.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.Id.PUT.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.Id.DELETE.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.POST.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.sync.POST.Route,
  Api.CommunityBusinesses.Me.VolunteerLogs.summary.GET.Route,
] = [

    {
      method: 'GET',
      path: '/community-businesses/me/volunteer-logs',
      options: {
        description: 'Retrieve volunteer logs for own community business',
        auth: {
          strategy: 'standard',
          access: {
            scope: ['volunteer_logs-sibling:read', 'volunteer_logs-child:read', 'volunteer_logs-own:read'],
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
      handler: async (request, h) => {
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

        const token = request.yar.id;

        //get UserId: Technical Debt see #573
        const userId = getCredentialsFromRequest(request).user.id;
        console.log('userId parsed in the volunteerLogs endpoint', userId);
        const queryown = {
          ...requestQueryToModelQuery<VolunteerLog>(_query),
          ...{ userId },
        }

        // use permission to check for only own 
        const canReadOthers = await VolunteerLogPermissions.canReadOthers(knex, userId);

        var logs;
        // if have permission to get others then continue, 
        if (canReadOthers == true) {
          console.log('canReadOthers and this is the console log!!!!');
          logs = await VolunteerLogs.fromCommunityBusiness(knex, communityBusiness, query);
        }
        //else execute the call for just the userId 
        else {
          console.log('getting own logs...');
          logs = await VolunteerLogs.getOwn(knex, communityBusiness, queryown);
        }
        //if userId != call userId boom 

        return Promise.all(logs.map(Serialisers.volunteerLogs.identity));
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
            scope: ['volunteer_logs-sibling:read', 'volunteer_logs-child:read', 'volunteer_logs-own:read'],
          },
        },
        validate: { query: { since, until } },
        response: { schema: response },
        pre: [
          { method: getCommunityBusiness, assign: 'communityBusiness' },
        ],
      },
      handler: async (request, h) => {
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

        return Serialisers.volunteerLogs.identity(log);
      },
    },

    {
      method: 'GET',
      path: '/community-businesses/me/get-volunteer-logs/{logId}',
      options: {
        description: 'Retrieve volunteer logs notes from specific log id',
        auth: {
          strategy: 'standard',
          access: {
            scope: ['volunteer_logs-sibling:read', 'volunteer_logs-child:read','volunteer_logs-own:read'],
          },
        },
        // validate: { query: { since, until } },
        response: { schema: response },
        pre: [
          { method: getCommunityBusiness, assign: 'communityBusiness' },
        ],
      },
      handler: async (request, h) => {
        const {
          server: { app: { knex } },
          params: { logId },
          pre: { communityBusiness },
        } = request;

        const log = await VolunteerLogs.getSimple(knex, logId);

        if (!log) {
          return Boom.notFound(`No log with ID: ${logId} found`);
        }

        return Serialisers.volunteerLogs.identity(log);
      },
    },


    {
      method: 'PUT',
      path: '/community-businesses/me/volunteer-logs/{userId}/{logId}',
      options: {
        description: 'Update volunteer logs noted of specific log id',
        auth: {
          strategy: 'standard',
          access: {
            scope: ['volunteer_logs-sibling:write', 'volunteer_logs-child:write', 'volunteer_logs-own:read'],
          },
        },
        validate: {
          params: { userId: userId, logId: id },
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
      handler: async (request, h) => {
        const {
          server: { app: { knex } },
          params: { userId, logId },
          payload,
          pre: { communityBusiness },
        } = request;

        const log = await VolunteerLogs.getOne(
          knex,
          { where: { id: Number(logId), userId: Number(userId), organisationId: communityBusiness.id } }
        );

        if (!log) {
          return Boom.notFound(`No log with ID: ${logId} found`);
        }

        const updatedLog = await VolunteerLogs.update(knex, log, payload);

        return Serialisers.volunteerLogs.identity(updatedLog);
      },
    },

    {
      method: 'PUT',
      path: '/community-businesses/me/volunteer-logs-notes/{logId}',
      options: {
        description: 'Update volunteer log notes for own community business',
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
            startedAt: Joi.date().iso().min(new Date(0)),
            notes: Joi.string().allow(""),
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
          params: { logId },
          payload,
          pre: { communityBusiness },
        } = request;

        const updatedLog = await VolunteerLogs.updateNotes(knex, logId, payload);

        return Serialisers.volunteerLogs.identity(updatedLog);
        // return updatedLog;
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
            scope: ['volunteer_logs-sibling:delete', 'volunteer_logs-child:delete', 'volunteer_logs-own:read'],
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
            note: Joi.string().allow("")
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
            scope.includes('volunteer_logs-sibling:write') ||
            scope.includes('volunteer_logs-own:write');  //for volunteer to write their own, ToDo: need to make sure dont't write for others!!!!

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

          return Serialisers.volunteerLogs.identity(log);

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
      handler: async (request: any, h: any) => {
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
      handler: async (request, h) => {
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
