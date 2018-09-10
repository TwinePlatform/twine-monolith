import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Joi from 'joi';
import * as bcrypt from 'bcrypt';
import { query, response, id } from './schema';
import { User, Visitors, CommunityBusiness, CommunityBusinesses } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { findAsync } from '../../../utils';


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
];


export default routes;
