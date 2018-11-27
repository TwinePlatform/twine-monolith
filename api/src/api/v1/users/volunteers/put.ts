import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Volunteers } from '../../../../models';
import {
  response,
   userName,
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
import { PutUserRequest } from '../../types';


const routes: Hapi.ServerRoute[] = [
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
      pre: [
        { method: requireSiblingUser, assign: 'isSibling' },
      ],
    },
    handler: async (request: PutUserRequest, h: Hapi.ResponseToolkit) => {
      const { server: { app: { knex } }, params: { userId }, payload } = request;

      const volunteer = await Volunteers.getOne(knex, { where: { id: Number(userId) } });
      // return error if user is not a volunteer
      if (!volunteer) return Boom.notFound('User is not a volunteer');

      const updatedVolunteer = await Volunteers.update(knex, volunteer, payload);
      return Volunteers.serialise(updatedVolunteer);
    },
  },
];

export default routes;
