import * as Hapi from 'hapi';
import { response } from './schema';
import { StandardCredentials } from '../../../auth/strategies/standard';


const routes: Hapi.ServerRoute[] = [

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
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const { organisation, roles } = StandardCredentials.fromRequest(request);

      return {
        organisationId: organisation.id,
        roles: roles.sort(),
      };
    },
  },

];

export default routes;
