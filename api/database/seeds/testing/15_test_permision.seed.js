exports.seed = (knex) =>
  knex('permission')
    .insert([
      { permission_entity: 'constants',
      permission_level: 'own',
      access_type: 'read',
  }]);
