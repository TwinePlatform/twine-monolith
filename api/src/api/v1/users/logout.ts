import * as Hapi from 'hapi';
import { query, response } from './schema';
import { Session } from '../../../auth/strategies/standard';


export default [
  {
    method: 'GET',
    path: '/users/logout',
    options: {
      description: 'Logout users',
      validate: { query },
      response: { schema: response },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return Session.destroy(request, h.response({}));
    },
  },
];
