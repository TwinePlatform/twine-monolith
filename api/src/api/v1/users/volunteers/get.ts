import * as Boom from '@hapi/boom';
import { Volunteers } from '../../../../models';
import { response } from '../schema';
import { id } from '../../schema/request';
import { requireSiblingUser } from '../../prerequisites';
import { Api } from '../../types/api';
import { Serialisers } from '../../serialisers';


const routes: [Api.Users.Volunteers.Id.GET.Route] = [
  {
    method: 'GET',
    path: '/users/volunteers/{userId}',
    options: {
      description: 'Retrieve a single volunteers details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:read', 'user_details-sibling:read'],
        },
      },
      validate: {
        params: { userId: id },
      },
      response: { schema: response },
      pre: [requireSiblingUser],
    },
    handler: async (request, h) => {
      const { server: { app: { knex } }, params: { userId } } = request;

      const volunteer = await Volunteers.getOne(knex, { where: {
        id: Number(userId),
        deletedAt: null,
      } });

      return volunteer
        ? Serialisers.volunteer(volunteer)
        : Boom.notFound('No volunteer found under this id');
    },
  },
];

export default routes;
