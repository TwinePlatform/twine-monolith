import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { since, until, ApiRequestQuery } from '../schema/request';
import { response } from '../schema/response';
import { isChildOrganisation } from '../prerequisites';
import { VolunteerLogs } from '../../../models';

export interface GetVolunteerLogsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    since: string
    until: string
  };
}

const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/volunteer-logs',
    options: {
      description: 'Retrieve a list of all volunteer logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['volunteer_logs-child:read'],
        },
      },
      validate: {
        query: { since, until },
      },
      response: { schema: response },
      pre: [
        { method: isChildOrganisation , assign: 'isChild' },
      ],
    },
    handler: async (request: GetVolunteerLogsRequest, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        query: { since, until },
        pre: { isChild } } = request;

      if (!isChild) {
        return Boom.forbidden('Not Implemented for non Twine Admin');
      }
      /*
       * TODO:
       * - implement full query handling
       * - implement child orgs for FUNDING_BODYs
       *
       * created to support temp-admin-dashboard
       */

      const volunteerLogs = await VolunteerLogs.get(knex,
        { fields: [
          'userId',
          'organisationId',
          'organisationName',
          'activity',
          'duration',
          'startedAt'],
          whereBetween: {
            startedAt:  since || until
          ? [
            new Date(since),
            new Date(until),
          ]
          : [null, null]},
        });

      return volunteerLogs;
    },
  },
];

export default routes;
