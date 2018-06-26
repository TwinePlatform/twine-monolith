exports.seed = (knex) =>
  knex('access_role')
    .insert([
      { access_role_name: 'VISITOR' },
      { access_role_name: 'VOLUNTEER' },
      { access_role_name: 'VOLUNTEER_ADMIN' },
      { access_role_name: 'ORG_ADMIN' },
      { access_role_name: 'TWINE_ADMIN' },
      { access_role_name: 'SYS_ADMIN' },
    ]);
