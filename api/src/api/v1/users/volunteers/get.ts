import * as Hapi from 'hapi';
import { Volunteers } from '../../../../models';
import { response } from '../schema';
import { id } from '../../schema/request';
import { getCommunityBusiness, isSiblingUser } from '../../prerequisites';


const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/users/volunteers/{userId}',
    options: {
      description: 'Retrieve own user details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:read', 'user_details-sibling:read'],
        },
      },
      validate: {
        params: { userId: id },
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
        { method: isSiblingUser, assign: 'isSibling' },
      ],
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, params: { userId } } = request;

      return Volunteers.getOne(knex, { where: { id: Number(userId) } });
    },
  },
];

export default routes;
