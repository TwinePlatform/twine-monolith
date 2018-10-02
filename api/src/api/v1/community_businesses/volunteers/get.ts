import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { has, pick, omit } from 'ramda';
import { User, ModelQuery, Volunteers } from '../../../../models';
import { query, response } from '../../users/schema';
import { meOrId } from '../schema';
import { getCommunityBusiness, isChildOrganisation } from '../../prerequisites';
import { GetAllVolunteersRequest } from '../../types';


const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/community-businesses/{organisationId}/volunteers',
    options: {
      description: 'Retreive list of all volunteers from an organisation',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:read', 'user_details-sibling:read'],
        },
      },
      validate: {
        params: { organisationId: meOrId },
        query: {
          ...query,
        },
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild' },
      ],
    },
    handler: async (request: GetAllVolunteersRequest, h: Hapi.ResponseToolkit) => {
      const { query, pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;

      /*
       * if id !== 'me' checks if user is a parent to accessed org
       * this only grants access to TWINE_ADMIN & FUNDING_BODY users
       */
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

      const modelQuery: ModelQuery<User> = { ...q, where: { deletedAt: null } };

      // TODO: Need to actually filtering and field option

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
];


export default routes;
