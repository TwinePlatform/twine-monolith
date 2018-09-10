import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import { has, flip } from 'ramda';
import { CommunityBusinesses, CommunityBusinessChangeSet } from '../../../models';
import { getCommunityBusiness, isChildOrganisation } from '../prerequisites';
import { PutCommunityBusinesssRequest } from '../types';
import { id, response } from './schema';


const hasAny = (props: string[], o: object) => props.map(flip(has)(o));


export default [
  {
    method: 'PUT',
    path: '/community-businesses/me',
    options: {
      description: 'Update own community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-own:write'],
        },
      },
      validate: {
        payload: {
          name: Joi.string().min(1),
          region: Joi.string().min(1),
          sector: Joi.string().min(1),
          logoUrl: Joi.string().uri(),
          address1: Joi.string().min(1),
          address2: Joi.string().min(1),
          townCity: Joi.string().min(1),
          postCode: Joi.string().min(6).max(10),
          turnoverBand: Joi.string().min(6).max(11),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: PutCommunityBusinesssRequest, h: Hapi.ResponseToolkit) => {
      const { payload, pre: { communityBusiness }, server: { app: { knex } } } = request;
      const changeSet: CommunityBusinessChangeSet = { ...payload };

      if (hasAny(['address1', 'address2', 'townCity', 'postCode'], payload)) {
        // TODO: recalculate coordinates
        // See https://github.com/TwinePlatform/twine-api/issues/144
      }

      try {
        const cb = await CommunityBusinesses.update(knex, communityBusiness, changeSet);

        return CommunityBusinesses.serialise(cb);
      } catch (error) {
        if (error.code.includes('235')) {
          return Boom.badRequest();
        }
      }

    },
  },

  {
    method: 'PUT',
    path: '/community-businesses/{organisationId}',
    options: {
      description: 'Update community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:write'],
        },
      },
      validate: {
        params: {
          organisationId: id,
        },
        payload: {
          name: Joi.string().min(1),
          region: Joi.string().min(1),
          sector: Joi.string().min(1),
          logoUrl: Joi.string().uri(),
          address1: Joi.string().min(1),
          address2: Joi.string().min(1),
          townCity: Joi.string().min(1),
          postCode: Joi.string().min(6).max(10),
          turnoverBand: Joi.string().min(6).max(11),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isChildOrganisation, assign: 'isChild' },
      ],
    },
    handler: async (request: PutCommunityBusinesssRequest, h: Hapi.ResponseToolkit) => {
      const { payload, pre: { communityBusiness, isChild }, server: { app: { knex } } } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permissions to access this resource');
      }

      const changeSet: CommunityBusinessChangeSet = { ...payload };

      if (hasAny(['address1', 'address2', 'townCity', 'postCode'], payload)) {
        // TODO: recalculate coordinates
        // See https://github.com/TwinePlatform/twine-api/issues/144
      }

      try {
        const cb = await CommunityBusinesses.update(knex, communityBusiness, changeSet);

        return CommunityBusinesses.serialise(cb);
      } catch (error) {
        if (error.code.includes('235')) {
          return Boom.badRequest();
        }
      }

    },
  },
] as Hapi.ServerRoute[];
