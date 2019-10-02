import * as Boom from '@hapi/boom';
import { Users } from '../../../models';
import { query, response } from './schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';


const routes: [
  Api.Users.GET.Route,
  Api.Users.Me.GET.Route
] = [
  {
    method: 'GET',
    path: '/users',
    options: {
      description: 'Retreive list of all users',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
      validate: { query },
      response: { schema: response },
    },
    handler: async () => {
      return Boom.notImplemented();
    },
  },

  {
    method: 'GET',
    path: '/users/me',
    options: {
      description: 'Retrieve own user details',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-own:read'],
        },
      },
      validate: {
        query,
      },
      response: { schema: response },
    },
    handler: async (request, h) => {
      const { user } = StandardCredentials.fromRequest(request);

      return Serialisers.user(user);
    },
  },
];

export default routes;
