import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { omit, filter, complement, isEmpty } from 'ramda';
import { query, response, id } from './schema';
import {
  Visitors,
  CommunityBusiness,
  CommunityBusinesses,
  GenderEnum } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { filterQuery } from '../users/schema';
import { ApiRequestQuery } from '../schema/request';
import Roles from '../../../auth/roles';
import { RoleEnum } from '../../../auth/types';

interface VisitorSearchRequest extends Hapi.Request {
  payload: {
    userId: number
    visitActivityId: number
  };
}

export interface GetVisitLogsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    [k: string]: any
    filter?: {
      age?: [number, number]
      gender?: GenderEnum
      activity?: string
    }
  };
}

const routes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/community-businesses/me/visit-logs',
    options: {
      description: 'For users to adds a visit to their community business',
      auth: {
        strategy: 'standard',
        scope: ['visit_logs-child:write'],
      },
      validate: {
        query,
        payload: {
          userId: id.required(),
          visitActivityId: id.required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: VisitorSearchRequest, h) => {
      const { payload: { userId, visitActivityId }, server: { app: { knex } } } = request;
      const communityBusiness = <CommunityBusiness> request.pre.communityBusiness;

      const visitor = await Visitors.getOne(knex, { where: { id: userId } });

      const isRegisteredVisitorAtCb = await Roles.userHas(knex, {
        userId,
        organisationId: communityBusiness.id,
        role: RoleEnum.VISITOR,
      });

      if (!isRegisteredVisitorAtCb) {
        return Boom.forbidden('Visitor is not registered at Community Business');
      }

      const activity = await CommunityBusinesses.getVisitActivityById(
        knex,
        communityBusiness,
        visitActivityId
      );

      if (!activity) {
        return Boom.badRequest('Activity not associated to Community Business');
      }

      return CommunityBusinesses.addVisitLog(knex, activity, visitor);
    },
  },
  {
    method: 'GET',
    path: '/community-businesses/me/visit-logs',
    options: {
      description: 'Retrieve a list of visit logs for your community business',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_logs-child:read'],
        },
      },
      validate: {
        query: {
          ...query,
          ...filterQuery,
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetVisitLogsRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        query: { limit, offset, filter: filterOptions = {} },
        pre: { communityBusiness } } = request;

      const query = filter(complement(isEmpty), {
        offset,
        limit,
        where: omit(['age'], filterOptions),
        whereBetween: filterOptions.age
        ? { birthYear: filterOptions.age }
        : {},
      });

      const visits = await CommunityBusinesses.getVisitLogsWithUsers(
        knex,
        communityBusiness,
        query
        );

      const count = (limit || offset)
        ? await CommunityBusinesses.getVisitLogsWithUsers(
          knex,
          communityBusiness,
          omit(['limit', 'offset'], query)
          ).then((rows: object[]) => rows.length)
        : visits.length;

      return {
        meta: {
          total: count,
        },
        result: visits,
      };
    },
  },
];

export default routes;
