import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import * as bcrypt from 'bcrypt';
import { query, response, id } from './schema';
import { User, Visitors, CommunityBusiness, CommunityBusinesses } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { findAsync } from '../../../utils';
import { filterQuery } from '../users/schema';

interface VisitorSearchRequest extends Hapi.Request {
  payload: {
    userId: number
    visitActivityId: number
    qrCode: string
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
        scope: ['visit_logs-own:write'],
      },
      validate: {
        query,
        payload: {
          userId: id.required(),
          visitActivityId: id.required(),
          qrCode: Joi.string().required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: VisitorSearchRequest, h) => {
      const { payload: { qrCode, userId, visitActivityId }, server: { app: { knex } } } = request;
      const communityBusiness = <CommunityBusiness> request.pre.communityBusiness;

      const visitors = await Visitors.fromCommunityBusiness(knex, communityBusiness);

      const visitor = await findAsync(visitors, (v: User) => bcrypt.compare(qrCode, v.qrCode));

      if (!visitor || visitor.id !== userId) {
        return Boom.badRequest('QR code invalid');
      }

      const activity = await CommunityBusinesses.getVisitActivityById(
        knex,
        communityBusiness,
        visitActivityId
      );

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
          scope: ['visit_logs-own:read'],
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
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { knex, pre: { communityBusiness } } = request;
      // TODO add filtering based on query
      return CommunityBusinesses.getVisitLogs(knex, communityBusiness, null);
    },
  },
  // {
  //   method: 'GET',
  //   path: '/community-businesses/me/visit-logs/aggregates',
  //   options: {
  //     description: 'Retrieve a list of all community businesses',
  //     auth: {
  //       strategy: 'standard',
  //       access: {
  //         scope: ['organisations_details-child:read'],
  //       },
  //     },
  //     validate: { query },
  //     response: { schema: response },
  //   },
  //   handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  //   },
  // },
];


export default routes;
