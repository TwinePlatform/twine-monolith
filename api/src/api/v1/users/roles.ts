import * as Hapi from 'hapi';
import { response } from './schema';
import Roles from '../../../auth/roles';
import { Credentials } from '../../../auth/strategies/standard';


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
      const {
        server: { app: { knex } },
      } = request;

      const { user, organisation } = Credentials.fromRequest(request);

      return {
        organisationId: organisation.id,
        role: await Roles.oneFromUser(knex, { userId: user.id, organisationId: organisation.id }),
      };
    },
  },

];

export default routes;
