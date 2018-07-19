const api = require('../../src/api/v1/api.json')

const permissionsForRoles = Object.values(api.routes).reduce((acc, el) => {
  const route = Object.values(el).reduce((acc2,el2) => 
      [...acc2, ...Object.values(el2)] ,[])
    .map(({ scope, intendedFor, description }) => ({ scope, intendedFor, description }))
  return [...acc, ...route]
},[]).reduce((acc, el) => {
  el.intendedFor.forEach(x => {
    if (el.scope.length > 0) acc[x].add(...el.scope)
  })
  return acc
}, {
  TWINE_ADMIN: new Set(),
  FUNDING_BODY: new Set(),
  ORG_ADMIN: new Set(),
  ORG_NON_ADMIN: new Set(),
  VISITOR: new Set(),
  VOLUNTEER: new Set(),
  VOLUNTEER_ADMIN: new Set(),
})

const allPermissions = Object.values(permissionsForRoles).reduce((acc, el) => {
  el.forEach(x => acc.add(x))
  return acc
}, new Set())

const rx = new RegExp('[-:]')

const scopeToPermission = ((permission) => {
  const [entity, permissionLevel, access] = permission.split(rx)
  return {
    permission_entity: entity,
    permission_level: permissionLevel,
    access_type: access
  }
})

const accessRolePermissionsRows = (client) => Object.entries(permissionsForRoles).reduce((acc, el) => {
    const rows = Array.from(el[1]).map(x=> ({
    access_role_id: client('access_role').select('access_role_id').where({
      access_role_name: el[0]
    }),
    permission_id: client('permission').select('permission_id').where(scopeToPermission(x)),
  }))
  return [...acc, ...rows]
}
,[])

module.exports = {
  permissionRows: Array.from(allPermissions).map(scopeToPermission),
  accessRolePermissionsRows,
}
