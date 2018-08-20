import * as Hapi from 'hapi';
import { query, response } from './schema';


export default [
  {
    method: 'POST',
    path: '/users/logout',
    options: {
      description: 'Logout users',
      auth: false,
      // validate: { query },
      response: { schema: response },
      cors:
      //  true,
      {
        origin: ['http://localhost:3000'],
        credentials: true,
        additionalHeaders: ['cookie'],
        additionalExposedHeaders: ['set-cookie'],
      },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      h.unstate('token');
      return {};
    },
  },
];
