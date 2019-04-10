import * as Knex from 'knex';
const perms = require('../seeds/permissions.seed.json');


const rx = new RegExp('[-:]');

const scopeToPermission = (permission: string) => {
  const [entity, permissionLevel, access] = permission.split(rx);
  return {
    permission_entity: entity,
    permission_level: permissionLevel,
    access_type: access,
  };
};

const accessRolePermissionsRows = (client: Knex) =>
  Object.entries(perms.permissionsForRoles)
  .reduce((acc, [role, permissions]: [string, string[]]) => {
    const rows = Array.from(permissions)
    .map((x) => ({
      access_role_id: client('access_role')
        .select('access_role_id')
        .where({ access_role_name: role }),
      permission_id: client('permission')
        .select('permission_id')
        .where(scopeToPermission(x)),
    }));

    return [...acc, ...rows];
  }, []);

const permissionRows = Array.from(perms.permissions).map(scopeToPermission);

export {
  permissionRows,
  accessRolePermissionsRows,
};
