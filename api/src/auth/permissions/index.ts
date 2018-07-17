import { PermissionsInitialiser } from './types';

const permissionsInitialiser: PermissionsInitialiser = (client) => {
  return {
    grantNew: async ({ resource, permissionLevel, access, role }) => {
      try {
        return await client.with('new_permission_id', (qb) => {
          qb
          .table('permission')
          .returning('permission_id')
          .insert({
            ['permission_entity']: resource,
            ['permission_level']: permissionLevel,
            ['access_type']: access,
          });
        })
        .insert({
          ['access_role_id']: client.select('access_role_id')
          .table('access_role')
          .where({ ['access_role_name']: role }),
          ['permission_id']: client.select('permission_id').from('new_permission_id'),
        })
        .into('access_role_permission')
        .returning('*');
      } catch (error) {
        switch (error.code) {
          case '23505':
            throw new Error('Permission already exists, please use grantExisting method');
          default:
            throw error;
        }
      }
    },
    grantExisting: async ({ resource, permissionLevel, access, role }) => {
      try {
        return await client.insert({
          ['access_role_id']: client.select('access_role_id')
            .table('access_role')
            .where({ ['access_role_name']: role }),
          ['permission_id']: client.select('permission_id')
            .from('permission')
            .where({
              ['permission_entity']: resource,
              ['permission_level']: permissionLevel,
              ['access_type']: access,
            }),
        })
        .into('access_role_permission')
        .returning('*');
      } catch (error) {
        switch (error.code) {
          case '23502':
            throw new Error('Permission entry or role does not exist, please use grantNew method');
          case '23505':
            throw new Error('Permission entry is already associated to this role');
          default:
            throw error;
        }
      }
    },
    revoke: async ({ resource, permissionLevel, access, role }) => {
      const roleId = await client
        .select('access_role_id')
        .table('access_role')
        .where({ ['access_role_name']: role })
        .then((res) => res[0].access_role_id);

      const permissionIds = await client
        .select('permission_id')
        .table('permission')
        .where({
          ['permission_entity']: resource,
          ['permission_level']: permissionLevel,
          ['access_type']: access,
        });

      if (permissionIds.length === 1) {
        const permissionId = permissionIds[0].permission_id;

        const deleteRow = await client('access_role_permission')
          .where({
            ['access_role_id']: roleId,
            ['permission_id']: permissionId,
          })
          .del();

        if (deleteRow === 0) throw new Error('Permission entry is not linked to role');
        return deleteRow;
      } else {
        throw new Error('Permission entry does not exist');
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
      const roleHasPermission = await client.raw('SELECT EXISTS ?', [inner]);
      return roleHasPermission.rows[0];
    },
    userHas: async ({ resource, permissionLevel, access, userId }) => {
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
      const userHasPermission = await client.raw('SELECT EXISTS ?', [inner]);
      return userHasPermission.rows[0];
    },
    permissionsForRole: async ({ roleId }) => {
      const query = await client('permission')
       .innerJoin(
        'access_role_permission',
        'permission.permission_id',
        'access_role_permission.permission_id')
      .select()
      .where({ 'access_role_permission.access_role_id': roleId });

      if (query.length === 0) {
        throw new Error('Role does not exist or has no associated permissions');
      }
      return query;

    },
  };
};

export default permissionsInitialiser;
