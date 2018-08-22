import * as Hapi from 'hapi';
import { query, response } from './schema';


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
      h.unstate('token');
      return {};
    },
  },
];
