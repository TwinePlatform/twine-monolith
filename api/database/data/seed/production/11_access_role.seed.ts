import * as Knex from 'knex';

exports.seed = (knex: Knex) =>
  knex('access_role')
    .insert([
      { access_role_name: 'VISITOR' },
      { access_role_name: 'VOLUNTEER' },
      { access_role_name: 'VOLUNTEER_ADMIN' },
      { access_role_name: 'CB_ADMIN' },
      { access_role_name: 'FUNDING_BODY' },
      { access_role_name: 'TWINE_ADMIN' },
      { access_role_name: 'SYS_ADMIN' },
    ]);
