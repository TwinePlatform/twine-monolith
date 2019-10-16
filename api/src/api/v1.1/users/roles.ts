import { response } from './schema';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { Api } from '../types/api';


const routes: [Api.Users.Me.Roles.GET.Route] = [

  {
    method: 'GET',
    path: '/users/me/roles',
    options: {
      description: 'Read own user roles',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['user_details-own:read'],
        },
      },
      response: { schema: response },
    },
    handler: async (request, h) => {
      const { organisation, roles } = StandardCredentials.fromRequest(request);

      return {
        organisationId: organisation.id,
        roles: roles.sort(),
      };
    },
  },

];

export default routes;
