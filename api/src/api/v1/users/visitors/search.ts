import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { query, response } from '../schema';
import { Visitors, CommunityBusiness } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';

interface VisitorSearchRequest extends Hapi.Request {
  payload: {
    qrCode: string
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

const routes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/users/visitors/search',
    options: {
      description: 'Search for visitors using their QR code',
      auth: {
        strategy: 'standard',
        scope: ['user_details-child:read'],
      },
      validate: {
        query,
        payload: {
          qrCode: Joi.string().required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: VisitorSearchRequest, h) => {
      const {
        payload: { qrCode },
        server: { app: { knex } },
      } = request;

      const visitor = await Visitors.getOne(knex, { where: { qrCode } });

      return visitor ? Visitors.serialise(visitor) : null;
    },
  },
];


export default routes;
