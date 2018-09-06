import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { compare } from 'bcrypt';
import { query, response } from '../schema';
import { Visitors, CommunityBusiness, User } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';
import { findAsync } from '../../../../utils';


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
      const { knex, payload: { qrCode }, pre: { communityBusiness } } = request;

      const visitors = await Visitors.fromCommunityBusiness(knex, communityBusiness);

      const visitor = await findAsync(visitors, (v: User) => compare(qrCode, v.qrCode));

      return visitor ? Visitors.serialise(visitor) : null;
    },
  },
];


export default routes;
