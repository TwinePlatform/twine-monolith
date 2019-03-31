// tslint:disable:max-line-length
import * as Knex from 'knex';
import * as moment from 'moment';


const now = moment().utc();

const getOrgId = (k: Knex, s: string) =>
  k('organisation')
    .select('organisation_id')
    .where({ organisation_name: s });

const getVolunteerId = (k: Knex, s: string) =>
  k('user_account')
    .innerJoin(
      'user_account_access_role',
      'user_account_access_role.user_account_id',
      'user_account.user_account_id')
    .select('user_account.user_account_id')
    .where({
      access_role_id: k('access_role').select('access_role_id').where({ access_role_name: 'VOLUNTEER' }),
      email: s,
    })
    .orWhere({
      access_role_id: k('access_role').select('access_role_id').where({ access_role_name: 'VOLUNTEER_ADMIN' }),
      email: s,
    });

const getProjectId = (k: Knex, s: string, n: string) =>
  k('volunteer_project')
    .select('volunteer_project_id')
    .where({
      volunteer_project_name: s,
      organisation_id: getOrgId(k, n),
    });

exports.seed = async (knex: Knex) =>
  knex('volunteer_hours_log')
    .insert([
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 1,
        volunteer_project_id: getProjectId(knex, 'Party', 'Black Mesa Research'),
        duration: (60 * 10) + 20, // 00:10:20
        started_at: now.clone().subtract(7, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 3,
        duration: (60 * 60 * 2) + (60 * 20), // 02:20:00
        started_at: now.clone().subtract(6, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 2,
        volunteer_project_id: getProjectId(knex, 'Take over the world', 'Black Mesa Research'),
        duration: 60 * 60 * 5, // 05:00:00
        started_at: now.clone().subtract(5, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: (60 * 50) + 59, // 00:50:59
        started_at: now.clone().subtract(4, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 4,
        duration: (60 * 60 * 1) + 20, // 01:00:20
        started_at: now.clone().subtract(3, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 6,
        duration: (60 * 10) + 20, // 00:10:20
        started_at: now.clone().subtract(1, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_project_id: getProjectId(knex, 'Party', 'Black Mesa Research'),
        volunteer_activity_id: 5,
        duration: 60 * 30, // 00:30:00
        started_at: now.clone(),
      },
      {
        organisation_id: getOrgId(knex, 'Aperture Science'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: 60 * 30, // 00:30:00
        started_at: now.clone().subtract(12, 'hour'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'raiden@aotd.com'),
        volunteer_activity_id: 1,
        duration: 60 * 35, // 00:35:00
        started_at: now.clone().subtract(12, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'raiden@aotd.com'),
        volunteer_activity_id: 1,
        duration: 60 * 12, // 00:12:00
        started_at: now.clone().add(12, 'day'),
      },
    ]);
