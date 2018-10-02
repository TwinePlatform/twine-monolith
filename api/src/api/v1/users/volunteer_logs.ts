import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import {
  response,
  since,
  until,
  query,
  ApiRequestQuery,
  id,
} from './schema';
import { VolunteerLogs, CommunityBusiness, VolunteerLog, CommonTimestamps } from '../../../models';
import { Omit } from '../../../types/internal';
import { getCommunityBusiness } from '../prerequisites';


interface GetMyVolunteerLogsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    since: string
    until: string
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

interface GetVolunteerLogRequest extends Hapi.Request {
  query: { fields: (keyof VolunteerLog)[] };
  params: { logId: string };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

interface PutMyVolunteerLogRequest extends Hapi.Request {
  params: { logId: string };
  payload: Partial<Omit<VolunteerLog, 'id' | 'userId' | 'organisationId' | keyof CommonTimestamps>>;
  pre: {
    communityBusiness: CommunityBusiness
  };
}


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
    handler: async (request: GetMyVolunteerLogsRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        pre: { communityBusiness },
        query,
      } = request;

      const since = new Date(query.since);
      const until = new Date(query.until);

      return VolunteerLogs.fromUserAtCommunityBusiness(
        knex,
        user,
        communityBusiness,
        { since, until, limit: query.limit, offset: query.offset }
      );
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
    handler: async (request: GetVolunteerLogRequest, h: Hapi.ResponseToolkit) => {
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
        : log;
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
    handler: async (request: PutMyVolunteerLogRequest, h: Hapi.ResponseToolkit) => {
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

      return VolunteerLogs.update(knex, log, { ...payload });
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
    handler: async (request: PutMyVolunteerLogRequest, h: Hapi.ResponseToolkit) => {
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
