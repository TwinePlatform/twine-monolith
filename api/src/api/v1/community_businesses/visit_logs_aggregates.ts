import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { omit, filter, complement, isEmpty } from 'ramda';
import { query, response } from './schema';
import { CommunityBusinesses } from '../../../models';
import { getCommunityBusiness } from '../prerequisites';
import { filterQuery } from '../users/schema';
import { GetVisitLogsRequest } from './visit_logs';

const routes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/community-businesses/me/visit-logs/aggregates',
    options: {
      description: 'Retrieve a list of aggregated visit data for your community businesses',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_logs-child:read'],
        },
      },
      validate: {
        query: {
          ...query,
          ...filterQuery,
        },
      },
      response: { schema: response },
      pre: [
        { method: getCommunityBusiness , assign: 'communityBusiness' },
      ],
    },
    handler: async (request: GetVisitLogsRequest, h: Hapi.ResponseToolkit) => {

      const {
        server: { app: { knex } },
        query: { filter: filterOptions = {}, fields },
        pre: { communityBusiness } } = request;
      /*
       * fields define what aggregates are returned.
       * If not fields are requested the respomse is empty.
       */
      if (!fields) return {};

      const query = filter(complement(isEmpty), {
        where: omit(['age'], filterOptions),
        whereBetween: filterOptions.age
          ? { birthYear: filterOptions.age }
          : {},
      });
      try {
        const aggregates = await CommunityBusinesses
          .getVisitLogAggregates(knex, communityBusiness, fields, query);

        return aggregates;
      } catch (error) {
        if (error.message.includes('are not supported aggregate fields')) {
          return Boom.badRequest(error.message);
        }
        return error;
      }
    },
  },
];

export default routes;
