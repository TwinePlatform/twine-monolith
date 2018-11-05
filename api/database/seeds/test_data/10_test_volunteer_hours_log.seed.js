const moment = require('moment');
const now = moment().utc();


const getOrgId = (k, s) =>
  k('organisation')
    .select('organisation_id')
    .where({ organisation_name: s });

const getVolunteerId = (k, s) =>
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

const getProjectId = (k, s, n) =>
  k('volunteer_project')
    .select('volunteer_project_id')
    .where({
      volunteer_project_name: s,
      organisation_id: getOrgId(n),
    });

exports.seed = (knex) =>
  knex('volunteer_hours_log')
    .insert([
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 1,
        volunteer_project_id: getProjectId(knex, 'Party', 'Black Mesa Research'),
        duration: (60 * 10) + 20,
        started_at: now.clone().subtract(7, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 3,
        duration: (60 * 60 * 2) + (60 * 20),
        started_at: now.clone().subtract(6, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 2,
        volunteer_project_id: getProjectId(knex, 'Take over the world', 'Black Mesa Research'),
        duration: 60 * 60 * 5,
        started_at: now.clone().subtract(5, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: (60 * 50) + 59,
        started_at: now.clone().subtract(4, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 4,
        duration: (60 * 60 * 1) + 20,
        started_at: now.clone().subtract(3, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 6,
        duration: (60 * 10) + 20,
        started_at: now.clone().subtract(1, 'day'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_project_id: getProjectId(knex, 'Party', 'Black Mesa Research'),
        volunteer_activity_id: 5,
        duration: 60 * 30,
        started_at: now.clone(),
      },
      {
        organisation_id: getOrgId(knex, 'Aperture Science'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: 60 * 30,
        started_at: now.clone().subtract(12, 'hour'),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'raiden@aotd.com'),
        volunteer_activity_id: 1,
        duration: 60 * 35,
        started_at: now.clone().subtract(12, 'day'),
      },
    ])
