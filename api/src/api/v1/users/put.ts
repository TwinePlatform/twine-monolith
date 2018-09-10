import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users, UserChangeSet } from '../../../models';
import {
  userName,
  gender,
  birthYear,
  email,
  phoneNumber,
  postCode,
  isEmailConsentGranted,
  isSMSConsentGranted,
  disability,
  ethnicity,
  response
} from './schema';
import { PutUserRequest } from '../types';


const routes: Hapi.ServerRoute[] = [

  {
    method: 'PUT',
    path: '/users/me',
    options: {
      description: 'Update own user details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-own:write'],
        },
      },
      validate: {
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
    },
    handler: async (request: PutUserRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        payload,
      } = request;

      const changeset = <UserChangeSet> { ...payload };

      try {
        const updatedUser = await Users.update(knex, user, changeset);

        return Users.serialise(updatedUser);

      } catch (error) {
        if (error.code === '23502') {
          return Boom.badRequest();
        } else {
          throw error;
        }
      }
    },
  },

];

export default routes;
