import permissionsInitialiser from '..';
import { PermissionLevel, Resource, Role, Access } from '../types';
const { getConfig } = require('../../../../config');
const { migrate } = require('../../../../database');
import * as knexInit from 'knex';

describe('Permisions Module', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = knexInit(config.knex);
  const permissionsInterface = permissionsInitialiser(knex);

  beforeAll(async () => {
    await migrate.teardown({ client: knex });
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await migrate.truncate({ client: knex });
    await knex.seed.run();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('::grantNew', () => {
    test('SUCCESS - Grant a role a permission entry that doesn\'t already exist', async () => {
      try {
        const currentPermissions = await knex('permission').select('*');
        const query = await permissionsInterface.grantNew({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.CHILD,
          role: Role.VISITOR});

        expect(query)
          .toEqual([{ access_role_id: 1, permission_id: currentPermissions.length + 1 }]);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('ERROR - Cannot grant a role a permission entry that already exists', async () => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.grantNew({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.ALL,
          role: Role.VOLUNTEER });
        expect(query).toBe(false);

      } catch (error) {
        expect(error.message).toBe('Permission already exists, please use grantExisting method');
      }
    });
  });

  describe('::grantExisting', () => {
    test('SUCCESS - Grant a role a permission entry that already exists', async () => {
      try {
        const permissionId = await knex('permission').select('permission_id').where({
          permission_entity: Resource.CONSTANTS,
          access_type: Access.WRITE,
          permission_level: PermissionLevel.ALL,
        }).then((x) => x[0].permission_id);
        const query = await permissionsInterface.grantExisting({
          resource: Resource.CONSTANTS,
          access: Access.WRITE,
          permissionLevel: PermissionLevel.ALL,
          role: Role.VOLUNTEER });
        expect(query)
          .toEqual(expect.arrayContaining([{ access_role_id: 2, permission_id: permissionId }]));
      } catch (error) {
        console.log(error);

        expect(error).toBeFalsy();
      }
    });
    test('ERROR - Cannot grant a permission that doesn\'t already exist', async () => {
      expect.assertions(1);
      try {
        await permissionsInterface.grantExisting({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.PARENT,
          role: Role.VISITOR });
      } catch (error) {
        expect(error.message).toBe(
          'Permission entry or role does not exist, please use grantNew method');
      }
    });
    test('ERROR - Duplicate link between role and permission entry', async () => {
      expect.assertions(1);
      try {
        await permissionsInterface.grantExisting({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.ALL,
          role: Role.VISITOR });
      } catch (error) {
        expect(error.message).toBe('Permission entry is already associated to this role');
      }
    });
  });

  describe('::revoke', () => {
    test('SUCCESS - deletes existing link between a permission entry and role', async () => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.revoke({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.ALL,
          role: Role.VISITOR });
        expect(query).toBe(1);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('ERROR - cannot delete when permission entry and role are not linked', async () => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.revoke({
          resource: Resource.CONSTANTS,
          access: Access.WRITE,
          permissionLevel: PermissionLevel.ALL,
          role: Role.VOLUNTEER });
        expect(query).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Permission entry is not linked to role');
      }
    });

    test('ERROR - cannot delete when permission entry does not exist', async () => {
      expect.assertions(1);
      try {
        await permissionsInterface.revoke({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.CHILD,
          role: Role.VOLUNTEER });
      } catch (error) {
        expect(error.message).toBe('Permission entry does not exist');
      }
    });
  });

  describe('::roleHas', () => {
    test('SUCCESS - returns false for non matching permissions & user', async () => {
      try {
        const query = await permissionsInterface.roleHas({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VOLUNTEER });
        expect(query.exists).toBe(false);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('SUCCESS - returns true for matching permissions & user', async () => {
      try {
        const query = await permissionsInterface.roleHas({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.ALL,
          role: Role.VISITOR });
        expect(query.exists).toBe(true);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });

  describe('::userHas', () => {
    test('SUCCESS - returns false for non matching permissions & user', async () => {
      try {
        const query = await permissionsInterface.userHas({ resource: Resource.CONSTANTS,
          access: Access.WRITE,
          permissionLevel: PermissionLevel.ALL,
          userId: 1 });
        expect(query.exists).toBe(false);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('SUCCESS - returns true for matching permissions & user', async () => {
      try {
        const query = await permissionsInterface.userHas({ resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.ALL,
          userId: 1 });
        expect(query.exists).toBe(true);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });

  describe('::getRolePermissions', () => {
    test('SUCCESS - returns all permissions associated with role', async () => {
      const result = await permissionsInterface.permissionsForRole({ roleId: 1 });
      expect(result).toEqual([
        {
          access_role_id: 1,
          access_type: 'read',
          permission_entity: 'constants',
          permission_id: 1,
          permission_level: 'all',
        },
        {
          access_role_id: 1,
          access_type: 'read',
          permission_entity: 'visit_activies',
          permission_id: 8, permission_level: 'own',
        },
        {
          access_role_id: 1, access_type: 'write',
          permission_entity: 'user_details',
          permission_id: 16, permission_level: 'own',
        },
        {
          access_role_id: 1, access_type: 'read',
          permission_entity: 'user_details',
          permission_id: 17,
          permission_level: 'own',
        },
        {
          access_role_id: 1, access_type: 'write',
          permission_entity: 'visit_logs',
          permission_id: 24,
          permission_level: 'parent',
        }]);
    });

    test('ERROR - returns error if role id does not exist', async () => {
      expect.assertions(1);
      try {
        await permissionsInterface.permissionsForRole({ roleId: 10 });
      } catch (error) {
        expect(error.message).toEqual('Role does not exist or has no associated permissions');
      }
    });
  });
});
