import * as Boom from '@hapi/boom';
import { since, until } from '../schema/request';
import { response } from '../schema/response';
import { requireChildOrganisation } from '../prerequisites';
import { VolunteerLogs } from '../../../models';
import { Api } from '../types/api';
import { Serialisers } from '../serialisers';


const routes: [Api.VolunteerLogs.GET.Route] = [
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
      pre: [requireChildOrganisation],
    },
    handler: async (request, h) => {
      const { server: { app: { knex } }, query: { since, until } } = request;

      /*
       * TODO:
       * - implement full query handling
       * - implement child orgs for FUNDING_BODYs
       *
       * created to support temp-admin-dashboard
       */

      const volunteerLogs = await VolunteerLogs.get(knex, {
        fields: [
          'userId',
          'userName',
          'organisationId',
          'organisationName',
          'activity',
          'duration',
          'startedAt'
        ],
        whereBetween: {
          startedAt: since || until
            ? [new Date(since), new Date(until)]
            : [null, null],
        },
        order: ['startedAt', 'asc'],
      });

      return Promise.all(volunteerLogs.map(Serialisers.volunteerLogs.defaultProjects));
    },
  },
];

export default routes;
