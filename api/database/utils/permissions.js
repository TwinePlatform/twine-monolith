const perms = require('../seeds/permissions.seed.json');

const restrictedScopes = {
  ORG_ADMIN: [
    "organisations_details-own:read",
    "organisations_feedback-own:write",
    "visit_activities-own:read",
    "visit_logs-own:write",
  ]
}

const rx = new RegExp('[-:]');

const scopeToPermission = ((permission) => {
  const [entity, permissionLevel, access] = permission.split(rx)
  return {
    permission_entity: entity,
    permission_level: permissionLevel,
    access_type: access
  }
});

const queryRestrictedPermissions = (client) =>
  Object.entries(restrictedScopes)
  .map(([role, scopes]) =>
    scopes.map((scope) => ({
      access_role_id: client('access_role')
        .select('access_role_id')
        .where({access_role_name: role }),
      permission_id: client('permission')
        .select('permission_id')
        .where(scopeToPermission(scope)),
      access_mode: 'restricted',
    }))
  )
  .reduce((acc, x) => acc.concat(x), []);

const accessRolePermissionsRows = (client) =>
  Object.entries(perms.permissionsForRoles)
  .reduce((acc, [roles, permissions]) => {
    const rows = Array.from(permissions)
    .map(x=> ({
      access_role_id: client('access_role')
        .select('access_role_id')
        .where({access_role_name: roles}),
      permission_id: client('permission')
        .select('permission_id')
        .where(scopeToPermission(x)),
    }))

    return [...acc, ...rows]
  }, []).concat(queryRestrictedPermissions(client));


module.exports = {
  permissionRows: Array.from(perms.permissions).map(scopeToPermission),
  accessRolePermissionsRows,
};
