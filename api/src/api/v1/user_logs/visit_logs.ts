import { since, until } from '../schema/request';
import { response } from '../schema/response';
import { requireChildOrganisation } from '../prerequisites';
import { Api } from '../types/api';


const routes: [Api.VisitLogs.GET.Route] = [
  {
    method: 'GET',
    path: '/visit-logs',
    options: {
      description: 'Retrieve a list of all visit logs',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['visit_logs-child:read'],
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
       * - move db query to model
       * - implement child orgs for FUNDING_BODYs
       *
       * created to support temp-admin-dashboard
       */

      const visits = await knex('visit_log')
        .select({
          id: 'visit_log_id',
          organisationName: 'organisation.organisation_name',
          userId: 'user_account.user_account_id',
          visitActivity: 'visit_activity_name',
          category: 'visit_activity_category_name',
          createdAt: 'visit_log.created_at',
          birthYear: 'user_account.birth_year',
          gender: 'gender.gender_name',
        })
        .innerJoin(
          'visit_activity',
          'visit_activity.visit_activity_id',
          'visit_log.visit_activity_id')
        .leftOuterJoin(
          'visit_activity_category',
          'visit_activity_category.visit_activity_category_id',
          'visit_activity.visit_activity_category_id')
        .innerJoin('user_account', 'user_account.user_account_id', 'visit_log.user_account_id')
        .innerJoin(
          'organisation',
          'visit_activity.organisation_id',
          'organisation.organisation_id')
        .innerJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .where({
          'visit_log.deleted_at': null,
        })
        .whereBetween('visit_log.created_at', since || until
          ? [
            new Date(since),
            new Date(until),
          ]
          : [null, null]);

      return visits;
    },
  },
];

export default routes;
