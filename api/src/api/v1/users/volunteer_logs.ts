import * as Hapi from 'hapi';
import { response, since, until, query } from './schema';
import { VolunteerLogs, CommunityBusiness } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { ApiRequestQuery } from '../schema/request';


interface GetMyVolunteerLogsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    since: string
    until: string
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}


const routes: Hapi.ServerRoute[] = [

  {
    method: 'GET',
    path: '/users/me/volunteer-logs',
    options: {
      description: 'Read own volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-parent:read'],
        },
      },
      validate: {
        query: { since, until, ...query },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetMyVolunteerLogsRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        auth: { credentials: { user } },
        pre: { communityBusiness },
        query,
      } = request;

      const since = new Date(query.since);
      const until = new Date(query.until);

      return VolunteerLogs.fromUserAtCommunityBusiness(
        knex,
        user,
        communityBusiness,
        { since, until, limit: query.limit, offset: query.offset }
      );
    },
  },

];

export default routes;
