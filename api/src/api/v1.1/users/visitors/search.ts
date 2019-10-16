import * as Joi from '@hapi/joi';
import { response } from '../schema';
import { Visitors } from '../../../../models';
import { getCommunityBusiness } from '../../prerequisites';
import { Api } from '../../types/api';
import { Serialisers } from '../../serialisers';


const routes: [Api.Users.Visitors.Search.POST.Route] = [
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
        payload: {
          qrCode: Joi.string().required(),
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request, h) => {
      const {
        payload: { qrCode },
        server: { app: { knex } },
      } = request;

      const visitor = await Visitors.getOne(knex, { where: { qrCode } });

      return visitor ? Serialisers.visitors.noSecrets(visitor) : null;
    },
  },
];


export default routes;
