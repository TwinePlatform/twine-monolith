import * as Boom from '@hapi/boom';
import { has, omit } from 'ramda';
import { User, ModelQuery, Volunteers } from '../../../../models';
import { VolunteerLogs } from '../../../../models';
import { query, response } from '../../users/schema';
import { meOrId, id } from '../schema';
import { getCommunityBusiness, isChildOrganisation } from '../../prerequisites';
import { Api } from '../../types/api';
import { requestQueryToModelQuery } from '../../utils';
import { Serialisers } from '../../serialisers';


const routes: [
  Api.CommunityBusinesses.Id.Volunteers.GET.Route,
  Api.CommunityBusinesses.Id.PushNotification.GET.Route,
] = [
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
          params: { organisationId: meOrId.required() },
          query: {
            ...query,
          },
        },
        response: { schema: response },
        pre: [
          { method: getCommunityBusiness, assign: 'communityBusiness' },
          { method: isChildOrganisation, assign: 'isChild' },
        ],
      },
      handler: async (request, h) => {
        const { query, pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;

        /*
         * if id !== 'me' checks if user is a parent to accessed org
         * this only grants access to TWINE_ADMIN & FUNDING_BODY users
         */
        if (request.params.organisationId !== 'me' && !isChild) {
          return Boom.forbidden('Insufficient permissions to access this resource');
        }

        const modelQuery: ModelQuery<User> = {
          ...requestQueryToModelQuery<User>(query),
          where: { deletedAt: null },
        };

        // TODO: Need to actually add filtering and field option

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
          result: await Promise.all(volunteers.map(Serialisers.volunteers.noSecrets)),
          meta: { total: count },
        };
      },
    },
    {
      method: 'GET',
      path: '/community-businesses/{organisationId}/push/{projectId}',
      options: {
        description: 'Retreive list of push notification token of all volunteers from a specific project',
        auth: {
          strategy: 'standard',
          access: {
            scope: ['user_details-child:read', 'user_details-sibling:read'],
          },
        },
        validate: {
          params: {
            organisationId: meOrId.required(),
            projectId: id.required()
          },
          query: {
            ...query,
          },
        },
        response: { schema: response },
        pre: [
          { method: getCommunityBusiness, assign: 'communityBusiness' },
          { method: isChildOrganisation, assign: 'isChild' },
        ],
      },
      handler: async (request, h) => {
        const {
          query,
          pre: { communityBusiness, isChild },
          server: { app: { knex } },
          params: { projectId },
        } = request;

        const volunteers = await Volunteers.fromProjectWithToken(knex, communityBusiness, projectId);

        return {
          result: await Promise.all(volunteers.map(Serialisers.volunteers.noSecrets)),
          meta: { total: 0 },
        };
      },
    },
  ];


export default routes;
