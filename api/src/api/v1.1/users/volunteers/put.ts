import * as Boom from '@hapi/boom';
import { Volunteers } from '../../../../models';
import {
  response,
  userName,
  password,
  gender,
  birthYear,
  email,
  phoneNumber,
  postCode,
  isEmailConsentGranted,
  isSMSConsentGranted,
  disability,
  ethnicity
} from '../schema';
import { id } from '../../schema/request';
import { requireSiblingUser } from '../../prerequisites';
import { Api } from '../../types/api';
import { Serialisers } from '../../serialisers';


const routes: [Api.Users.Volunteers.Id.PUT.Route] = [
  {
    method: 'PUT',
    path: '/users/volunteers/{userId}',
    options: {
      description: 'Update a single volunteers details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write', 'user_details-sibling:write'],
        },
      },
      validate: {
        params: { userId: id },
        payload: {
          name: userName,
          password,
          gender,
          birthYear,
          email,
          phoneNumber,
          postCode,
          isEmailConsentGranted,
          isSMSConsentGranted,
          disability,
          ethnicity,
        },
      },
      response: { schema: response },
      pre: [requireSiblingUser],
    },
    handler: async (request, h) => {
      const { server: { app: { knex } }, params: { userId }, payload } = request;

      const volunteer = await Volunteers.getOne(knex, { where: { id: Number(userId) } });
      // return error if user is not a volunteer
      if (!volunteer) return Boom.notFound('User is not a volunteer');

      const updatedVolunteer = await Volunteers.update(knex, volunteer, payload);
      return Serialisers.volunteers.noSecrets(updatedVolunteer);
    },
  },
];

export default routes;
