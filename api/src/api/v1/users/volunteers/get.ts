import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Volunteers } from '../../../../models';
import { response } from '../schema';
import { id } from '../../schema/request';
import { requireSiblingUser } from '../../prerequisites';


const routes: Hapi.ServerRoute[] = [
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
        failAction: (request, h, err) => err,
      },
      response: { schema: response },
      pre: [
        { method: requireSiblingUser, assign: 'requireSibling' },
      ],
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, params: { userId } } = request;

      const volunteer = await Volunteers.getOne(knex, { where: {
        id: Number(userId),
        deletedAt: null,
      } });

      return volunteer
        ? Volunteers.serialise(volunteer)
        : Boom.notFound('No volunteer found under this id');
    },
  },
];

export default routes;
