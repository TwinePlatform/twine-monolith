import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Volunteers } from '../../../../models';
import { response } from '../schema';
import { id } from '../../schema/request';
import { requireSiblingUser } from '../../prerequisites';
import { DeleteUserRequest } from '../../types';


const routes: Hapi.ServerRoute[] = [
  {
    method: 'DELETE',
    path: '/users/volunteers/{userId}',
    options: {
      description: 'Soft delete a single volunteer',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write', 'user_details-sibling:write'],
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
    handler: async (request: DeleteUserRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, params: { userId } } = request;
      const volunteer = await Volunteers.getOne(knex, { where: { id: Number(userId) } });
      // return error if user is not a volunteer
      if (!volunteer) return Boom.notFound('User is not a volunteer');

      // if user is successfully deleted return null
      if (await Volunteers.destroy(knex, volunteer)) return null;

      // if user was not successfully deleted return error
      return Boom.internal('Unable to delete user at this time');
    },
  },
];

export default routes;
