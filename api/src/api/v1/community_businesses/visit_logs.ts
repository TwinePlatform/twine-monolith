import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { omit, filter, complement, isEmpty } from 'ramda';
import { query, response, id, since, until } from './schema';
import { Visitors, CommunityBusinesses } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { filterQuery } from '../users/schema';
import Roles from '../../../models/role';
import { RoleEnum } from '../../../models/types';
import { Api } from '../types/api'


const routes: [
  Api.CommunityBusinesses.Me.VisitLogs.POST.Route,
  Api.CommunityBusinesses.Me.VisitLogs.GET.Route,
] = [
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
        payload: {
          userId: id.required(),
          visitActivityId: id.required(),
          signInType: Joi.string().valid(['sign_in_with_name', 'qr_code']).required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        pre: { communityBusiness },
        payload: { userId, visitActivityId, signInType },
        server: { app: { knex } } } = request;

      const visitor = await Visitors.getOne(knex, { where: { id: userId } });

      const isRegisteredVisitorAtCb = await Roles.userHasAtCb(knex, {
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

      return CommunityBusinesses.addVisitLog(knex, activity, visitor, signInType);
    },
  },
  {
    method: 'GET',
    path: '/community-businesses/me/visit-logs',
    options: {
      description: 'Retrieve a list of visit logs for your community business',
      auth: {
        strategies: ['standard', 'external'],
        access: {
          scope: ['visit_logs-child:read', 'api:visitor:read'],
        },
      },
      validate: {
        query: {
          since,
          until,
          ...query,
          ...filterQuery,
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        server: { app: { knex } },
        query: { limit, offset, filter: filterOptions = {}, since, until },
        pre: { communityBusiness } } = request;

      const whereBetween = filter(Boolean, {
        birthYear: filterOptions.age || undefined,
        createdAt: [since, until],
      });

      const query = filter(complement(isEmpty), {
        offset,
        limit,
        where: omit(['age'], filterOptions),
        whereBetween,
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
