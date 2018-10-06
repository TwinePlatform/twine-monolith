import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { response, id } from './schema';
import Roles from '../../../auth/roles';
import { RoleEnum } from '../../../auth/types';
import { VolunteerLogs } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { PostMyVolunteerLogsRequest } from '../types';


const routes: Hapi.ServerRoute[] = [

  {
    method: 'POST',
    path: '/community-businesses/me/volunteer-logs',
    options: {
      description: 'Create volunteer log for own user',
      auth: {
        strategy: 'standard',
        access: {
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

];

export default routes;
