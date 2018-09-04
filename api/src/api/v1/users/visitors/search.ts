import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { query, response } from '../schema';
import { Visitors, CommunityBusiness, User } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';


interface VisitorSearchRequest extends Hapi.Request {
  payload: {
    qrCode: string
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
      const { knex, payload: { qrCode } } = request;
      const communityBusiness = <CommunityBusiness> request.pre.communityBusiness;

      const visitors = await Visitors.fromCommunityBusiness(knex, communityBusiness);

      const visitor = visitors.find((v: User) => v.qrCode === qrCode);

      return visitor ? Visitors.serialise(visitor) : null;
    },
  },
];


export default routes;
