exports.seed = (knex) =>
  knex('access_role_permission')
    .insert([
      { access_role_id: 1,
      permission_id: 1,
  }]);
