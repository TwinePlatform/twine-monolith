import * as Knex from 'knex';
import { getTrx } from '../../../../tests/utils/database';
import { PermissionLevelEnum, ResourceEnum, RoleEnum, AccessEnum } from '../../types';
import Permissions from '..';
const { getConfig } = require('../../../../config');


describe('Permisions Module', () => {
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  describe('::grantNew', () => {
    test('SUCCESS - Grant a role a permission entry that doesn\'t already exist', async () => {
      try {
        const [{ count: permissionsCount }] = await trx('permission')
          .select('')
          .count();
        const query = await Permissions.grantNew(trx, {
          resource: ResourceEnum.ORG_OUTREACH,
          access: AccessEnum.WRITE,
          permissionLevel: PermissionLevelEnum.PARENT,
          role: RoleEnum.VOLUNTEER,
        });

        expect(query)
          .toEqual([{
            access_role_id: 2,
            permission_id: Number(permissionsCount) + 1,
          }]);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('ERROR - Cannot grant a role a permission entry that already exists', async () => {
      expect.assertions(1);
      try {
        const query = await Permissions.grantNew(trx, {
          resource: ResourceEnum.ORG_DETAILS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.PARENT,
          role: RoleEnum.VOLUNTEER,
        });
        expect(query).toBe(false);

      } catch (error) {
        expect(error.message).toBe('Permission already exists, please use grantExisting method');
      }
    });
  });

  describe('::grantExisting', () => {
    test('SUCCESS - Grant a role a permission entry that already exists', async () => {
      try {
        const [{ permission_id: permissionId }] = await trx('permission')
        .select('permission_id').where({
          permission_entity: ResourceEnum.CONSTANTS,
          access_type: AccessEnum.WRITE,
          permission_level: PermissionLevelEnum.ALL,
        });

        const query = await Permissions.grantExisting(trx, {
          resource: ResourceEnum.CONSTANTS,
          access: AccessEnum.WRITE,
          permissionLevel: PermissionLevelEnum.ALL,
          role: RoleEnum.VOLUNTEER,
        });
        expect(query)
          .toEqual(expect.arrayContaining([{
            access_role_id: 2,
            permission_id: permissionId,
          }]));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('ERROR - Cannot grant a permission that doesn\'t already exist', async () => {
      expect.assertions(1);
      try {
        await Permissions.grantExisting(trx, {
          resource: ResourceEnum.CONSTANTS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.PARENT,
          role: RoleEnum.VOLUNTEER,
        });
      } catch (error) {
        expect(error.message).toBe(
          'Permission entry or role does not exist, please use grantNew method');
      }
    });
    test('ERROR - Duplicate link between role and permission entry', async () => {
      expect.assertions(1);
      try {
        await Permissions.grantExisting(trx, {
          resource: ResourceEnum.VISIT_ACTIVITIES,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.OWN,
          role: RoleEnum.CB_ADMIN,
        });
      } catch (error) {
        expect(error.message).toBe('Permission entry is already associated to this role');
      }
    });
  });

  describe('::revoke', () => {
    test('SUCCESS - deletes existing link between a permission entry and role', async () => {
      expect.assertions(1);
      try {
        const query = await Permissions.revoke(trx, {
          resource: ResourceEnum.USER_DETAILS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.CHILD,
          role: RoleEnum.CB_ADMIN,
        });
        expect(query).toBe(1);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('ERROR - cannot delete when permission entry and role are not linked', async () => {
      expect.assertions(1);
      try {
        const query = await Permissions.revoke(trx, {
          resource: ResourceEnum.CONSTANTS,
          access: AccessEnum.WRITE,
          permissionLevel: PermissionLevelEnum.ALL,
          role: RoleEnum.VOLUNTEER,
        });
        expect(query).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Permission entry is not linked to role');
      }
    });

    test('ERROR - cannot delete when permission entry does not exist', async () => {
      expect.assertions(1);
      try {
        await Permissions.revoke(trx, {
          resource: ResourceEnum.CONSTANTS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.CHILD,
          role: RoleEnum.VOLUNTEER,
        });
      } catch (error) {
        expect(error.message).toBe('Permission entry does not exist');
      }
    });
  });

  describe('::roleHas', () => {
    test('SUCCESS - returns false for non matching permissions & user', async () => {
      try {
        const query = await Permissions.roleHas(trx, {
          resource: ResourceEnum.CONSTANTS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.OWN,
          role: RoleEnum.VOLUNTEER,
        });
        expect(query).toBe(false);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('SUCCESS - returns true for matching permissions & user', async () => {
      try {
        const query = await Permissions.roleHas(trx, {
          resource: ResourceEnum.ORG_OUTREACH,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.PARENT,
          role: RoleEnum.VOLUNTEER_ADMIN,
        });
        expect(query).toBe(true);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });

  describe('::userHas', () => {
    test('SUCCESS - returns false for non matching permissions & user', async () => {
      try {
        const query = await Permissions.userHas(trx, {
          resource: ResourceEnum.VOLUNTEER_LOGS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.OWN,
          userId: 1,
        });
        expect(query).toBe(false);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('SUCCESS - returns true for matching permissions & user', async () => {
      try {
        const query = await Permissions.userHas(trx, {
          resource: ResourceEnum.USER_DETAILS,
          access: AccessEnum.READ,
          permissionLevel: PermissionLevelEnum.OWN,
          userId: 2,
        });
        expect(query).toBe(true);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });

  describe('::forRoles', () => {
    test('SUCCESS - returns all permissions associated with all roles', async () => {
      const result = await Permissions.forRoles(
        trx,
        { roles: [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN] }
      );

      expect(result).toHaveLength(15);
      expect(result).toEqual(expect.arrayContaining([
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.ORG_DETAILS,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.ORG_OUTREACH,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.ORG_VOLUNTEERS,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.ORG_VOLUNTEERS,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.DELETE,
          resource: ResourceEnum.ORG_VOLUNTEERS,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.USER_DETAILS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.USER_DETAILS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.USER_DETAILS,
          permissionLevel: PermissionLevelEnum.SIBLING,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.USER_DETAILS,
          permissionLevel: PermissionLevelEnum.SIBLING,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.DELETE,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.SIBLING,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.SIBLING,
        },
        {
          access: AccessEnum.DELETE,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.SIBLING,
        },
      ]));
    });

    test('SUCCESS - returns all permissions associated with all roles', async () => {
      const result = await Permissions.forRoles(
        trx,
        { roles: [RoleEnum.VOLUNTEER, RoleEnum.VISITOR] }
      );

      expect(result).toHaveLength(8);
      expect(result).toEqual(expect.arrayContaining([
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.ORG_DETAILS,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.ORG_OUTREACH,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.ORG_VOLUNTEERS,
          permissionLevel: PermissionLevelEnum.PARENT,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.USER_DETAILS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.USER_DETAILS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.READ,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.WRITE,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
        {
          access: AccessEnum.DELETE,
          resource: ResourceEnum.VOLUNTEER_LOGS,
          permissionLevel: PermissionLevelEnum.OWN,
        },
      ]));
    });

    test('SUCCESS - returns empty array for role with no permissions', async () => {
      const permissions = await Permissions.forRoles(trx, { roles: [RoleEnum.VISITOR] });
      expect(permissions).toHaveLength(0);
    });

    test('ERROR - returns error if none of the roles exist', async () => {
      expect.assertions(1);
      try {
        await trx('access_role')
          .del()
          .where({ access_role_name: RoleEnum.VOLUNTEER });

        await Permissions.forRoles(trx, { roles: [RoleEnum.VOLUNTEER] });
      } catch (error) {
        expect(error.message).toEqual('One or more of the roles VOLUNTEER do not exist');
      }
    });

    test('ERROR - returns error if one of the roles do not exist', async () => {
      expect.assertions(1);
      try {
        await trx('access_role')
          .del()
          .whereIn('access_role_name', [RoleEnum.VOLUNTEER]);

        await Permissions.forRoles(trx, { roles: [RoleEnum.VOLUNTEER, RoleEnum.CB_ADMIN] });
      } catch (error) {
        expect(error.message)
          .toEqual('One or more of the roles VOLUNTEER,CB_ADMIN do not exist');
      }
    });
  });
});
