import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import * as moment from 'moment';
import { pick, mergeDeepRight } from 'ramda';
import { Visitors, User, ModelQuery } from '../../../models';
import {
  query,
  filterQuery,
  response,
  id,
  userName,
  birthYear,
  gender,
  disability,
  ethnicity,
  email,
  phoneNumber,
  postCode,
  isEmailConsentGranted,
  isSMSConsentGranted,
} from '../users/schema';
import { meOrId } from './schema';
import { GetVisitorsRequest, PutUserRequest } from '../types';
import { getCommunityBusiness, isChildOrganisation, isChildUser } from '../prerequisites';


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

      const ageToBirthYear = (age: number) => moment().year() - age;

      // fields
      // TODO: Need to actually filter the object
      const fields = <(keyof User)[]> _fields;

      const modelQuery: ModelQuery<User> = { fields, ...q, where: { deletedAt: null } };

      // age filter
      if (filter && filter.age) {
        modelQuery.whereBetween = mergeDeepRight(
          modelQuery.whereBetween || {},
          { birthYear: [filter.age.map(ageToBirthYear)] }
        );
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

  {
    method: 'PUT',
    path: '/community-businesses/{organisationId}/visitors/{userId}',
    options: {
      description: 'Update child users details; NOTE: "PUT /users/:id" offers same functionality',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write'],
        },
      },
      validate: {
        params: {
          userId: id,
          organisationId: meOrId,
        },
        payload: {
          name: userName,
          gender,
          birthYear,
          email,
          phoneNumber,
          postCode,
          isEmailConsentGranted,
          isSMSConsentGranted,
          disability,
          ethnicity,
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
        { method: isChildUser, assign: 'isChild' },
      ],
    },
    handler: async (request: PutUserRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        payload,
        pre: { isChild, communityBusiness },
        params: { userId },
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permission to access this resource');
      }

      const changeset = { ...payload };

      const [user] = await Visitors.fromCommunityBusiness(
        knex,
        communityBusiness,
        { where: { id: Number(userId) } }
      );

      if (!user) {
        return Boom.notFound(`User with id ${userId} not found`);
      }

      try {
        const updatedUser = await Visitors.update(knex, user, changeset);

        return Visitors.serialise(updatedUser);

      } catch (error) {
        // Intercept subset of class 23 postgres error codes thrown by `knex`
        // Class 23 corresponds to integrity constrain violation
        // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
        // Happens, for e.g., if try to set a sector or region that doesn't exist
        // TODO:
        // Handle this better, preferably without having to perform additional check
        // queries. See https://github.com/TwinePlatform/twine-api/issues/147
        if (error.code === '23502') {
          return Boom.badRequest();
        } else {
          throw error;
        }
      }
    },
  },
];

export default routes;
