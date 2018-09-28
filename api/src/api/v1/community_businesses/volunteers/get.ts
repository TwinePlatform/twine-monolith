import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { has, pick, mergeDeepRight, omit } from 'ramda';
import { User, ModelQuery, Volunteers } from '../../../../models';
import { query, filterQuery, response } from '../../users/schema';
import { meOrId, id } from '../schema';
import { getCommunityBusiness, isChildOrganisation, isChildUser } from '../../prerequisites';
import { VolunteersRequest } from '../../types';


const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/volunteers',
    options: {
      description: 'Retreive list of all volunteers from an organisation',
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
        },
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild' },
      ],
    },
    handler: async (request: VolunteersRequest, h: Hapi.ResponseToolkit) => {
      const { query, pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;
      const { filter, fields: _fields } = query;

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

      // gender filter
      if (filter && filter.gender) {
        modelQuery.where = mergeDeepRight(
          modelQuery.where || {},
          { gender: filter.gender }
        );
      }

      const volunteers =
        await Volunteers.fromCommunityBusiness(knex, communityBusiness, modelQuery);

      const count = has('limit', modelQuery) || has('offset', modelQuery)
        ? await Volunteers.fromCommunityBusiness(
            knex,
            communityBusiness,
            omit(['limit', 'offset'], modelQuery)
          )
          .then((res) => res.length)
        : volunteers.length;

      return {
        result: await Promise.all(volunteers.map(Volunteers.serialise)),
        meta: { total: count },
      };
    },
  },

  {
    method: 'GET',
    path: '/community-businesses/me/volunteers/{userId}',
    options: {
      description: 'Retreive list of all volunteers from an organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:read'],
        },
      },
      validate: {
        params: {
          userId: id,
        },
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildUser, assign: 'isChildUser' },
      ],
    },
    handler: async (request: VolunteersRequest, h: Hapi.ResponseToolkit) => {
      const {
        params: { userId },
        pre: { isChildUser, communityBusiness: cb },
        server: { app: { knex } },
      } = request;

      if (!isChildUser) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const [volunteer] =
        await Volunteers.fromCommunityBusiness(knex, cb, { where: { id: Number(userId) } });

      /* istanbul ignore next */
      if (!volunteer) {
        // This _should_ be impossible because of the `isChildUser` pre-requisite
        return Boom.notFound('No visitor with this id');
      }

      return Volunteers.serialise(volunteer);
    },
  },
];


export default routes;
