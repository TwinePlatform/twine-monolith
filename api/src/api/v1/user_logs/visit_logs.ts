import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { since, until, ApiRequestQuery } from '../schema/request';
import { response } from '../schema/response';
import { isChildOrganisation } from '../prerequisites';

export interface GetVisitLogsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    since: string
    until: string
  };
}

const routes: Hapi.ServerRoute[] = [
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
      pre: [
        { method: isChildOrganisation , assign: 'isChild' },
      ],
    },
    handler: async (request: GetVisitLogsRequest, h: Hapi.ResponseToolkit) => {
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
       * - move db query to model
       * - implement child orgs for FUNDING_BODYs
       *
       * created to support temp-admin-dashboard
       */

      const visits = await knex('visit')
        .select({
          id: 'visit_id',
          organisationName: 'organisation.organisation_name',
          userId: 'user_account.user_account_id',
          visitActivity: 'visit_activity_name',
          category: 'visit_activity_category_name',
          createdAt: 'visit.created_at',
          birthYear: 'user_account.birth_year',
          gender: 'gender.gender_name',
        })
        .innerJoin('visit_activity', 'visit_activity.visit_activity_id', 'visit.visit_activity_id')
        .leftOuterJoin(
          'visit_activity_category',
          'visit_activity_category.visit_activity_category_id',
          'visit_activity.visit_activity_category_id')
        .innerJoin('user_account', 'user_account.user_account_id', 'visit.user_account_id')
        .innerJoin(
          'organisation',
          'visit_activity.organisation_id',
          'organisation.organisation_id')
        .innerJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .where({
          'visit.deleted_at': null,
        })
        .whereBetween('visit.created_at', since || until
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
