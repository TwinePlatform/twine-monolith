exports.seed = (knex) =>
  knex('user_account_access_role')
    .insert([
      { user_account_id: 1,
      organisation_id: 1,
      access_role_id: 1,
  }]);
