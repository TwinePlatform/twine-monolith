import { uniqWith, equals } from 'ramda';
import { PermissionInterface, PermissionTuple } from '../types';


const Permissions: PermissionInterface = {
  grantNew: async (client, { resource, permissionLevel, access, role }) => {
    try {
      // "return await" necessary to trap errors here instead of caller
      return await client.with('new_permission_id', (qb) =>
        qb.table('permission')
          .returning('permission_id')
          .insert({
            ['permission_entity']: resource,
            ['permission_level']: permissionLevel,
            ['access_type']: access,
          })
      )
      .insert({
        ['access_role_id']: client('access_role')
          .select('access_role_id')
          .where({ ['access_role_name']: role }),
        ['permission_id']: client('new_permission_id')
          .select('permission_id'),
      })
      .into('access_role_permission')
      .returning('*');

    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new Error('Permission already exists, please use grantExisting method');
        /* istanbul ignore next */
        default:
          throw error;
      }
    }
  },

  grantExisting: async (client, { resource, permissionLevel, access, role }) => {
    try {
      // "return await" necessary to trap errors here instead of caller
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
        /* istanbul ignore next */
        default:
          throw error;
      }
    }
  },

  revoke: async (client, { resource, permissionLevel, access, role }) => {
    const [{ access_role_id: roleId }] = await client
      .select('access_role_id')
      .from('access_role')
      .where({ ['access_role_name']: role });

    const permissionIds = await client
      .select('permission_id')
      .from('permission')
      .where({
        ['permission_entity']: resource,
        ['permission_level']: permissionLevel,
        ['access_type']: access,
      });

    if (permissionIds.length !== 1) {
      throw new Error('Permission entry does not exist');
    }

    const deleteRow = await client('access_role_permission')
      .where({
        ['access_role_id']: roleId,
        ['permission_id']: permissionIds[0].permission_id,
      })
      .del();

    if (deleteRow === 0) {
      throw new Error('Permission entry is not linked to role');
    }

    return deleteRow;
  },

  roleHas: async (client, { resource, permissionLevel, access, role }) => {
    const inner = client
      .select()
      .from('permission')
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
    const { rows } = await client.raw('SELECT EXISTS ?', [inner]);
    return rows[0].exists;
  },

  userHas: async (client, { resource, permissionLevel, access, userId }) => {
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
    const { rows } = await client.raw('SELECT EXISTS ?', [inner]);
    return rows[0].exists;
  },

  forRoles: async (client, { roles, accessMode = 'full' }) => {
    const accessRoles = (await client('access_role')
      .select('access_role_id')
      .whereIn('access_role_name', roles))
      .map(((x: any) => x.access_role_id));

    if (accessRoles.length !== roles.length) {
      throw new Error(`One or more of the roles ${roles} do not exist`);
    }

    const query = await client('permission')
      .innerJoin(
        'access_role_permission',
        'permission.permission_id',
        'access_role_permission.permission_id')
      .select({
        access: 'access_type',
        resource: 'permission_entity',
        permissionLevel: 'permission_level',
      })
      .whereIn(
        'access_role_permission.access_role_id',
        accessRoles
      )
      .andWhere({
        ['access_role_permission.access_mode']: accessMode,
      });

    return uniqWith(equals, query) as PermissionTuple[];
  },
};

export default Permissions;
