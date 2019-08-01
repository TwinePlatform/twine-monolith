import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';
import { has, mergeDeepRight, omit, keys, assoc } from 'ramda';
import { Visitors, User, ModelQuery } from '../../../../models';
import {
  query,
  userName,
  gender,
  response,
  email,
  postCode,
  phoneNumber,
} from '../../users/schema';
import { meOrId, id } from '../schema';
import { GetVisitorsRequest, GetVisitorRequest } from '../../types';
import { getCommunityBusiness, isChildOrganisation, isChildUser } from '../../prerequisites';
import { requestQueryToModelQuery } from '../../utils';


const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/visitors',
    options: {
      description: 'Retreive list of all visitors from an organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:read'],
        },
      },
      validate: {
        params: { organisationId: meOrId.required() },
        query: {
          ...query,
          filter: Joi.object({
            age: Joi.array().length(2).items(Joi.number().integer().min(0)),
            gender,
            name: userName,
            email,
            postCode,
            phoneNumber,
            visitActivity: Joi.string(),
          }),
          visits: Joi.boolean().default(false),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild' },
      ],
    },
    handler: async (request: GetVisitorsRequest, h: Hapi.ResponseToolkit) => {
      const { query, pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;
      const { visits, filter } = query;

      if (request.params.organisationId !== 'me' && !isChild) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const modelQuery: ModelQuery<User> = {
        ...requestQueryToModelQuery<User>(query),
        where: { deletedAt: null },
      };

      // age filter
      if (filter && filter.age) {
        modelQuery.whereBetween = { birthYear: filter.age };
      }

      modelQuery.where = mergeDeepRight(
        modelQuery.where,
        keys(omit(['age', 'visitActivity'], filter))
          .reduce((acc, k) => assoc(k, filter[k], acc), {})
      );

      const visitors = await (visits
        ? Visitors.getWithVisits(
            knex, communityBusiness, modelQuery, filter ? filter.visitActivity : undefined)
        : Visitors.fromCommunityBusiness(knex, communityBusiness, modelQuery));

      const count = has('limit', modelQuery) || has('offset', modelQuery)
        ? await Visitors.fromCommunityBusiness(
            knex,
            communityBusiness,
            omit(['limit', 'offset'], modelQuery)
          )
          .then((res) => res.length)
        : visitors.length;

      return {
        result: await Promise.all((<User[]> visitors).map((v) => Visitors.serialise(v))),
        meta: { total: count },
      };
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me/visitors/{userId}',
    options: {
      description: 'Retreive list of all visitors from an organisation',
      auth: {
        strategies: ['standard', 'external'],
        access: {
          scope: ['user_details-child:read', 'api:visitor:read'],
        },
      },
      validate: {
        params: {
          userId: id,
        },
        query: {
          visits: Joi.boolean().default(false),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildUser, assign: 'isChildUser' },
      ],
    },
    handler: async (request: GetVisitorRequest, h: Hapi.ResponseToolkit) => {
      const {
        query: { visits },
        params: { userId },
        pre: { isChildUser, communityBusiness: cb },
        server: { app: { knex } },
      } = request;

      if (!isChildUser) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const [visitor] = await (visits
        ? Visitors.getWithVisits(knex, cb, { where: { id: Number(userId) } })
        : Visitors.fromCommunityBusiness(knex, cb, { where: { id: Number(userId) } }));

      /* istanbul ignore next */
      if (!visitor) {
        // This _should_ be impossible because of the `isChildUser` pre-requisite
        return Boom.notFound('No visitor with this id');
      }

      return Visitors.serialise(visitor);
    },
  },
];


export default routes;
