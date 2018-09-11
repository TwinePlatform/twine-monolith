exports.seed = (knex) =>
  knex('user_account_access_role')
    .insert([
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Chell' }),
        organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Aperture Science' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VISITOR' }),
      },
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'GlaDos' }),
        organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Aperture Science' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'ORG_ADMIN' }),
      },
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Gordon' }),
        organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Black Mesa Research' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'ORG_ADMIN' }),
      },
      /*
       * Barney deliberately has no role, do not add one
       */
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Big Boss' }),
        organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Aperture Science' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'TWINE_ADMIN' }),
      },
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Emma Emmerich' }),
        organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Black Mesa Research' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VOLUNTEER' }),
      }
  ]);
