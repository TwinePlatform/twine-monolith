const moment = require('moment');
const now = moment();

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
    });


exports.seed = (knex) =>
  knex('volunteer_hours_log')
    .insert([
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 1,
        duration: (60 * 10) + 20,
        started_at: now.clone().day(-7),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 3,
        duration: (60 * 60 * 2) + (60 * 20),
        started_at: now.clone().day(-6),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 2,
        duration: 60 * 60 * 5,
        started_at: now.clone().day(-5),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: (60 * 50) + 59,
        started_at: now.clone().day(-4),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 4,
        duration: (60 * 60 * 1) + 20,
        started_at: now.clone().day(-3),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 6,
        duration: (60 * 10) + 20,
        started_at: now.clone().day(-1),
      },
      {
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: 60 * 30,
        started_at: now.clone(),
      },
      {
        organisation_id: getOrgId(knex, 'Aperture Science'),
        user_account_id: getVolunteerId(knex, 'emma@sol.com'),
        volunteer_activity_id: 5,
        duration: 60 * 30,
        started_at: now.clone().hour(-12),
      },
    ])
