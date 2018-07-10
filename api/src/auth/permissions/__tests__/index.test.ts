import permissionsInitialiser from '..';
import { PermissionLevel, Resource, Role, Access } from '../types';
const { getConfig } = require('../../../../config');
const { migrate } = require('../../../../database');
import * as knexInit from 'knex';

describe('Permisions Module', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = knexInit(config.knex);
  const permissionsInterface = permissionsInitialiser(knex);
  beforeAll(async() => {
    await migrate.teardown({ client: knex });
    await knex.migrate.latest();
  });
  beforeEach(async () => {
    await migrate.truncate({ client: knex });
    await knex.seed.run();
  });

  afterAll(async() => {
    await knex.destroy();
  });

  describe('::grantNew', () => {
    test('SUCCESS - Grant a role a permission entry that doesn\'t already exist', async() => {
      try {
        const query = await permissionsInterface.grantNew({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.CHILD,
          role:Role.VISITOR});
        expect(query).toEqual(expect.arrayContaining([{ access_role_id: 1, permission_id: 2 }]));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('ERROR - Cannot grant a role a permission entry that already exists', async() => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.grantNew({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VOLUNTEER });
        expect(query).toBe(false);

      } catch (error) {
        expect(error.message).toBe('Permission already exists, please use grantExisting method');
      }
    });
  });

  describe('::grantExisting', () => {
    test('SUCCESS - Grant a role a permission entry that already exists', async() => {
      try {
        const query = await permissionsInterface.grantExisting({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VOLUNTEER });
        expect(query).toEqual(expect.arrayContaining([{ access_role_id: 2, permission_id: 1 }]));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('ERROR - Cannot grant a permission that doesn\'t already exist', async() => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.grantExisting({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.PARENT,
          role: Role.VISITOR });
      } catch (error) {
        expect(error.message).toBe(
          'Permission entry or role does not exist, please use grantNew method');
      }
    });
    test('ERROR - Duplicate link between role and permission entry', async() => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.grantExisting({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VISITOR });
      } catch (error) {
        expect(error.message).toBe('Permission entry is already associated to this role');
      }
    });
  });

  describe('::revoke', () => {
    test('SUCCESS - deletes existing link between a permission entry and role', async() => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.revoke({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VISITOR });
        expect(query).toBe(1);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('ERROR - cannot delete when permission entry and role are not linked', async() => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.revoke({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VOLUNTEER });
        expect(query).toBe(false);
      } catch (error) {
        expect(error.message).toBe('Permission entry is not linked to role');
      }
    });

    test('ERROR - cannot delete when permission entry does not exist', async() => {
      expect.assertions(1);
      try {
        const query = await permissionsInterface.revoke({
          resource: Resource.ORG_DETAILS,
          access: Access.READ,
          permissionLevel: PermissionLevel.CHILD,
          role: Role.VOLUNTEER });
      } catch (error) {
        expect(error.message).toBe('Permission entry does not exist');
      }
    });
  });

  describe('::roleHas', () => {
    test('SUCCESS - returns false for non matching permissions & user', async() => {
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
    test('SUCCESS - returns true for matching permissions & user', async() => {
      try {
        const query = await permissionsInterface.roleHas({
          resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          role: Role.VISITOR });
        expect(query.exists).toBe(true);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });

  describe('::userHas', () => {
    test('SUCCESS - returns false for non matching permissions & user', async() => {
      try {
        const query = await permissionsInterface.userHas({ resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.CHILD,
          userId:1 });
        expect(query.exists).toBe(false);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
    test('SUCCESS - returns true for matching permissions & user', async() => {
      try {
        const query = await permissionsInterface.userHas({ resource: Resource.CONSTANTS,
          access: Access.READ,
          permissionLevel: PermissionLevel.OWN,
          userId:1 });
        expect(query.exists).toBe(true);
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });
  });
});
