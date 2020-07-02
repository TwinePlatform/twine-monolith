import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import {
  id,
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
  ethnicity,
  response,
  pushtoken
} from './schema';
import { Api } from '../types/api';
import { requireChildUser } from '../prerequisites';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Serialisers } from '../serialisers';


const routes: [
  Api.Users.Me.PUT.Route,
  Api.Users.Id.PUT_simple.Route,
  Api.Users.Id.PUT.Route,
] = [

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
            // NOTE: "password" added as a field to support
            //       existing functionality in legacy volunteer app
            password,
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
      handler: async (request, h) => {
        const {
          server: { app: { knex } },
          payload,
        } = request;

        const { user } = StandardCredentials.fromRequest(request);
        const changeset = { ...payload };

        try {
          const updatedUser = await Users.update(knex, user, changeset);

          return Serialisers.users.noSecrets(updatedUser);

        } catch (error) {
          // Intercept subset of class 23 postgres error codes thrown by `knex`
          // Class 23 corresponds to integrity constrain violation
          // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
          // Happens, for e.g., if try to set a sector or region that doesn't exist
          // TODO:
          // Handle this better, preferably without having to perform additional check
          // queries. See https://github.com/TwinePlatform/twine-api/issues/147
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
      path: '/users/insertpushtoken/{userId}',
      options: {
        description: 'Update push token',
        auth: {
          strategy: 'standard',
          access: {
            scope: ['user_details-own:write'],
          },
        },
        validate: {
          params: { userId: id },
          payload: {
            pushtoken: pushtoken,
          },
        },
        response: { schema: response },
      },
      handler: async (request, h) => {
        const {
          server: { app: { knex } },
          params: { userId },
          payload,
        } = request;

        // const payload = request.payload
        // const knex = request.server.app.knex

        // const { userId } = StandardCredentials.fromRequest(request);
        // const changeset = { ...payload };

        // try {
        const updatedToken = await Users.updateToken(knex, userId, payload);

        return Serialisers.users.noSecrets(updatedToken);

        // } catch (error) {
        //   // Intercept subset of class 23 postgres error codes thrown by `knex`
        //   // Class 23 corresponds to integrity constrain violation
        //   // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
        //   // Happens, for e.g., if try to set a sector or region that doesn't exist
        //   // TODO:
        //   // Handle this better, preferably without having to perform additional check
        //   // queries. See https://github.com/TwinePlatform/twine-api/issues/147
        //   if (error.code === '23502') {
        //     return Boom.badRequest();
        //   } else {
        //     throw error;
        //   }
        // }
      },
    },

    {
      method: 'PUT',
      path: '/users/{userId}',
      options: {
        description: `
      Update child user's details;
      NOTE: "PUT /community-businesses/:id/visitors/:id" offers similar functionality
    `,
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
            // NOTE: "password" added as a field to support
            //       existing functionality in legacy volunteer app
            password,
            phoneNumber,
            postCode,
            isEmailConsentGranted,
            isSMSConsentGranted,
            disability,
            ethnicity,
          },
        },
        response: { schema: response },
        pre: [requireChildUser],
      },
      handler: async (request, h) => {
        const {
          server: { app: { knex } },
          payload,
          params: { userId },
        } = request;

        const changeset = { ...payload };

        const user = await Users.getOne(knex, { where: { id: Number(userId) } });

        if (!user) {
          return Boom.notFound(`User with id ${userId} not found`);
        }

        try {
          const updatedUser = await Users.update(knex, user, changeset);

          return Serialisers.users.noSecrets(updatedUser);

        } catch (error) {
          // Intercept subset of class 23 postgres error codes thrown by `knex`
          // Class 23 corresponds to integrity constrain violation
          // See https://www.postgresql.org/docs/10/static/errcodes-appendix.html
          // Happens, for e.g., if try to set a sector or region that doesn't exist
          // TODO:
          // Handle this better, preferably without having to perform additional check
          // queries. See https://github.com/TwinePlatform/twine-api/issues/147
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
