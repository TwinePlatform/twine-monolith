import * as Boom from '@hapi/boom';
import { Volunteers } from '../../../../models';
import { response } from '../schema';
import { id } from '../../schema/request';
import { requireSiblingUser } from '../../prerequisites';
import { Api } from '../../types/api';


const routes: [Api.Users.Volunteers.Id.DELETE.Route] = [
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
      },
      response: { schema: response },
      pre: [
        { method: requireSiblingUser, assign: 'requireSibling' },
      ],
    },
    handler: async (request, h) => {
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
