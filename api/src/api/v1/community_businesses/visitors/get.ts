import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { pick, mergeDeepRight } from 'ramda';
import { Visitors, User, ModelQuery } from '../../../../models';
import { query, filterQuery, response } from '../../users/schema';
import { meOrId } from '../schema';
import { GetVisitorsRequest } from '../../types';
import { getCommunityBusiness, isChildOrganisation } from '../../prerequisites';


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
        params: { organisationId: meOrId },
        query: {
          ...query,
          ...filterQuery,
          visits: Joi.boolean().default(false),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
        { method: isChildOrganisation , assign: 'isChild' },
      ],
    },
    handler: async (request: GetVisitorsRequest, h: Hapi.ResponseToolkit) => {
      const { query, pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;
      const { visits, filter, fields: _fields } = query;

      if (request.params.organisationId !== 'me' && !isChild) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const q: {
        limit?: number,
        offset?: number,
        order?: [string, 'asc' | 'desc']
      } = {
        ...pick(['limit', 'offset'], query),
        order: query.sort ? [query.sort, query.order || 'asc'] : undefined,
      };

      // fields
      // TODO: Need to actually filter the object
      const fields = <(keyof User)[]> _fields;

      const modelQuery: ModelQuery<User> = { fields, ...q, where: { deletedAt: null } };

      // age filter
      if (filter && filter.age) {
        modelQuery.whereBetween = { birthYear: filter.age };
      }

      // activity filter
      if (filter && filter.activity) {
        modelQuery.where = mergeDeepRight(
          modelQuery.where || {},
          { activity: filter.activity }
        );
      }

      // gender filter
      if (filter && filter.gender) {
        modelQuery.where = mergeDeepRight(
          modelQuery.where || {},
          { gender: filter.gender }
        );
      }

      const visitors = await (visits
        ? Visitors.getWithVisits(knex, communityBusiness, modelQuery)
        : Visitors.fromCommunityBusiness(knex, communityBusiness, modelQuery));

      return Promise.all(visitors.map(Visitors.serialise));
    },
  },
];


export default routes;
