import * as knex from 'knex';
import { PermissionsInitialiser, GetPermissionIds, GetRoleId } from './permissions';

const getPermissionIds: GetPermissionIds = ({ client, resource, permissionLevel, access }) =>
  client
    .select('permission_id')
    .table('permission')
    .where({
      ['permission_entity']: resource,
      ['permission_level']: permissionLevel,
      ['access_type']: access,
    });

const getRoleId: GetRoleId = async({ client, role }) =>
  client
    .select('access_role_id')
    .table('access_role')
    .where({ ['access_role_name']: role })
    .then((res) => res[0].access_role_id);

const permissionsInitialiser: PermissionsInitialiser = (config) => {
  const client = knex(config);
  return {
    grantExisting: async ({ resource, permissionLevel, access, role }) => {
      const roleId = await getRoleId({ client, role });

      const permissionIds = await getPermissionIds({
        client,
        resource,
        permissionLevel,
        access });

      if (permissionIds.length === 1) {
        const permissionId = permissionIds[0].permission_id;

        const insertPermission = await client('access_role_permission')
            .returning('*')
            .insert(
              client.select({
                ['access_role_id']: roleId,
                ['permission_id']: permissionId,
              })
                .whereNotExists(client('access_role_permission').where({
                  ['access_role_id']: roleId,
                  ['permission_id']: permissionId,
                }))
            );
        if (insertPermission.length === 0) {
          throw new Error('Permission entry is already associated to this role');
        }
        client.destroy();
        return insertPermission;
      } else {
        client.destroy();
        throw new Error('Permission entry does not exists, please use grantNew method');
      }
    },
    grantNew: async ({ resource, permissionLevel, access, role }) => {
      const roleId = await getRoleId({ client, role });

      const permissionIds = await getPermissionIds({
        client,
        resource,
        permissionLevel,
        access });

      if (permissionIds.length === 0) {
        const createPermissionId = await client('permission')
            .returning('permission_id')
            .insert({
              ['permission_entity']: resource,
              ['permission_level']: permissionLevel,
              ['access_type']: access,
            });

        const permissionId = createPermissionId[0];
        const insertPermission = await client('access_role_permission')
            .returning('*')
            .insert({
              ['access_role_id']: roleId,
              ['permission_id']: permissionId,
            });
        client.destroy();
        return insertPermission;
      } else {
        throw new Error('Permission already exists, please use grantExisting method');
        client.destroy();
      }
    },
    revoke: async ({ resource, permissionLevel, access, role }) => {
      const roleId = await getRoleId({ client, role });

      const permissionIds = await getPermissionIds({
        client,
        resource,
        permissionLevel,
        access });

      if (permissionIds.length === 1) {
        const permissionId = permissionIds[0].permission_id;

        const deleteRow = await client('access_role_permission')
            .where({
              ['access_role_id']: roleId,
              ['permission_id']: permissionId,
            })
            .del();

        if (deleteRow === 1) return deleteRow;
        throw new Error('Permission entry is not linked to role');
      }
    },
      // todo - currently no definitive list of permission entries
      // grantAll: () => {},
      // revokeAll: () => {},
    roleHas: async ({ resource, permissionLevel, access, role }) => {
      const inner = client
          .select()
          .table('permission')
          .innerJoin('access_role_permission',
            'permission.permission_id',
            'access_role_permission.permission_id')
          .innerJoin('access_role',
            'access_role.access_role_id',
            'access_role_permission.access_role_id')
          .where({
            ['access_role.access_role_name']: role,
            ['permission.access_type']: access,
            ['permission.permission_entity']: resource,
            ['permission.permission_level']: permissionLevel,
          });
      const roleHasPermission = client.raw('SELECT EXISTS ?', [inner]);
      const result = await roleHasPermission;
      client.destroy();
      return result.rows[0];
    },
    userHas: async({ resource, permissionLevel, access, userId }) => {
      const inner = client
        .select()
        .table('permission')
        .innerJoin('access_role_permission',
          'permission.permission_id',
          'access_role_permission.permission_id')
        .innerJoin('access_role',
          'access_role.access_role_id',
          'access_role_permission.access_role_id')
        .innerJoin('user_account_access_role',
        'user_account_access_role.access_role_id',
        'access_role.access_role_id')
        .where({
          ['user_account_access_role.user_account_id']: userId,
          ['permission.access_type']: access,
          ['permission.permission_entity']: resource,
          ['permission.permission_level']: permissionLevel,
        });
      const userHasPermission = client.raw('SELECT EXISTS ?', [inner]);
      const result = await userHasPermission;
      client.destroy();
      return result.rows[0];
    },
  };
};

const roles = {
  add: () => {},
  remove: () => {},
  move: () => {},
  removeUserFromAll: () => {},
  hasPermission: () => {},
  userHas: () => {},
};

export { permissionsInitialiser };
