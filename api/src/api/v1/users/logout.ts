import * as Hapi from '@hapi/hapi';
import { query, response } from './schema';
import { Sessions } from '../../../auth/strategies/standard';


export default [
  {
    method: 'GET',
    path: '/users/logout',
    options: {
      description: 'Logout users',
      validate: {
        query,
      },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      Sessions.destroy(request);
      return {};
    },
  },
] as Hapi.ServerRoute[];
