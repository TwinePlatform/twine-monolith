const { accessRolePermissionsRows } = require('../../utils')

exports.seed = (knex) =>
  knex('access_role_permission')
  .insert(accessRolePermissionsRows(knex))
  