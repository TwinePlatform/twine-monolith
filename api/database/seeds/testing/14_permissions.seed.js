const { permissionRows } = require('../../utils')

exports.seed = (knex) =>
  knex('permission')
    .insert(permissionRows)
