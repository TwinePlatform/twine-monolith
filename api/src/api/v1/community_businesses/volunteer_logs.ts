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
          scope: [
            'volunteer_logs-child:write',
            'volunteer_logs-sibling:write',
            'volunteer_logs-own:write',
          ],
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
        auth: { credentials: { user, role, scope } },
        pre: { communityBusiness },
        payload,
      } = request;

      if (payload.userId) {
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
          scope: ['volunteer_logs-own:write', 'volunteer_logs-sibling:write'],
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
          scope: [
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
        pre: { communityBusiness },
      } = request;

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
