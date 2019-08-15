import * as Hapi from '@hapi/hapi';
import { quiet } from 'twine-util/promises';
import { query, response } from './schema';
import { Sessions } from '../../../auth/strategies/standard';
import { UserSessionRecords } from '../../../models/user_session_record';


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
      quiet(UserSessionRecords.endSession(request.server.app.knex, request.yar.id, 'log_out'));
      Sessions.destroy(request);
      return {};
    },
  },
] as Hapi.ServerRoute[];
