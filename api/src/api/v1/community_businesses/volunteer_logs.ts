import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { response, id } from './schema';
import Roles from '../../../auth/roles';
import { RoleEnum } from '../../../auth/types';
import { VolunteerLogs, Duration, Volunteers } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { PostMyVolunteerLogsRequest, SyncMyVolunteerLogsRequest } from '../types';


const routes: Hapi.ServerRoute[] = [

  {
    method: 'POST',
    path: '/community-businesses/me/volunteer-logs',
    options: {
      description: 'Create volunteer log for own user',
      auth: {
        strategy: 'standard',
        access: {
          // TO BE REPLACED: "parent" with "sibling" (and possibly "child")
          scope: ['volunteer_logs-parent:write', 'volunteer_logs-own:write'],
        },
      },
      validate: {
        payload: {
          userId: id,
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

      /*
       * TO BE REPLACED
       *
       * Because of the way the scopes currently work, we must check the
       * role here. See https://github.com/TwinePlatform/twine-api/pull/175#discussion_r223072650
       *
       * As soon as https://github.com/TwinePlatform/twine-api/issues/187 is
       * resolved, this should be changed to avoid explicit reference to roles
       */
      if (payload.userId) {
        const isTargetVolunteer = await Roles.userHas(knex, {
          userId: payload.userId,
          organisationId: communityBusiness.id,
          role: [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
        });

        const isUserAdmin = await Roles.userHas(knex, {
          userId: user.id,
          organisationId: communityBusiness.id,
          role: [RoleEnum.ORG_ADMIN, RoleEnum.VOLUNTEER_ADMIN],
        });

        // To continue, userId must correspond to VOLUNTEER/VOLUNTEER_ADMIN
        // and scope must include 'volunteer_logs-own:write'
        if (!isTargetVolunteer) {
          return Boom.badRequest('User ID does not correspond to a volunteer');
        }

        if (!isUserAdmin) {
          return Boom.forbidden('Insufficient permission');
        }
      }

      try {
        const log = await VolunteerLogs.add(knex, {
          userId: user.id,
          ...payload, // if payload contains userId, will overwrite existing
          organisationId: communityBusiness.id,
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
    method: 'POST',
    path: '/community-businesses/me/volunteer-logs/sync',
    options: {
      description: 'Synchronise volunteer logs for own use at community business',
      auth: {
        strategy: 'standard',
        access: {
          // TO BE REPLACED: "parent" with "own"
          scope: ['volunteer_logs-parent:write'],
        },
      },
      validate: {
        payload: Joi.array().items(Joi.object({
          activity: Joi.string().required(),
          duration: Joi.object({
            hours: Joi.number().integer().min(0),
            minutes: Joi.number().integer().min(0),
            seconds: Joi.number().integer().min(0),
          }).required(),
          startedAt: Joi.date().iso().max('now').default(() => new Date().toISOString(), 'now'),
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
        auth: { credentials: { user } },
        pre: { communityBusiness },
        payload,
      } = request;

      try {
        await knex.transaction(async (trx) =>
          Promise.all(payload.map(async (log) =>
            VolunteerLogs.add(knex, {
              ...log,
              organisationId: communityBusiness.id,
              userId: user.id,
            })
          ))
        );

        return null;

      } catch (error) {
        if (error.code === '23502') { // Violation of null constraint implies invalid activity
          return Boom.badRequest('Invalid activity');
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
          // TO BE REPLACED: "volunteer_logs-parent" with "volunteer_logs-child"
          scope: [
            'volunteer_logs-parent:read',
            'volunteer_logs-own:read',
            'organisations_details-parent:read',
            'organisations_details-own:read',
          ],
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
        auth: { credentials: { scope } },
        pre: { communityBusiness },
      } = request;

      /*
       * This manual checking of scopes is necessary because
       * hapi.js scopes specification isn't capable of capturing
       * complex scope rules e.g ((x AND y) OR (a AND b)).
       *
       * See: https://hapijs.com/api#-routeoptionsauthaccessscope
       */
      const hasParentScopes =
        scope.includes('volunteer_logs-parent:read') &&
        scope.includes('organisation_details-parent:read');

      const hasOwnScopes =
        scope.includes('volunteer_logs-own:read') &&
        scope.includes('organisation_details-own:read');

      if (!hasParentScopes && !hasOwnScopes) {
        return Boom.forbidden('Insufficient scope');
      }

      const logs = await VolunteerLogs.get(
        knex,
        {
          fields: ['duration'],
          where: { organisationId: communityBusiness.id },
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
