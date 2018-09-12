import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users } from '../../../models';
import {
  id,
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
import { isChildUser } from '../prerequisites';


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

      const changeset = { ...payload };

      try {
        const updatedUser = await Users.update(knex, user, changeset);

        return Users.serialise(updatedUser);

      } catch (error) {
        // TODO: Better way to handle this.
        if (error.code === '23502') {
          return Boom.badRequest();
        } else {
          throw error;
        }
      }
    },
  },

  {
    method: 'PUT',
    path: '/users/{userId}',
    options: {
      description: 'Update child user\'s details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-child:write'],
        },
      },
      validate: {
        params: {
          userId: id,
        },
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
        { method: isChildUser, assign: 'isChild' },
      ],
    },
    handler: async (request: PutUserRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        payload,
        pre: { isChild },
        params: { userId },
      } = request;

      if (!isChild) {
        return Boom.forbidden('Insufficient permission to access this resource');
      }

      const changeset = { ...payload };

      const user = await Users.getOne(knex, { where: { id: Number(userId) } });

      if (!user) {
        return Boom.notFound(`User with id ${userId} not found`);
      }

      try {
        const updatedUser = await Users.update(knex, user, changeset);

        return Users.serialise(updatedUser);

      } catch (error) {
        // TODO: Better way to handle this.
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
