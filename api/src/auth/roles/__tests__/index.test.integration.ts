import { Role } from '../../permissions/types';

import * as knexInit from 'knex';
import rolesInitialiser from '..';
import { getConfig } from '../../../../config';
const { migrate } = require('../../../../database');


describe('Roles Module', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = knexInit(config.knex);
  const rolesInterface = rolesInitialiser(knex);

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

  describe('::add', () => {
    test('SUCCESS - adds role for a user', async () => {
      try {
        const result = await rolesInterface.add(
          { role: Role.VOLUNTEER, userId: 1, organisationId: 1 });
        expect(result).toEqual(expect.objectContaining(
          { access_role_id: 2,
            organisation_id: 1,
            user_account_id: 1 }
        ));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('ERROR - throws error if user/role link exists', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.add({ role: Role.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toBe('User is already associated with this role at this organistion');
      }
    });

    test('ERROR - throws error if user id does not exists', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.add({ role: Role.VISITOR, userId: 3, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          /* tslint:disable */
          `Foreign key does not exist: Key (user_account_id)=(3) is not present in table \"user_account\".`
          /* tslint:enable */
        );
      }
    });
  });

  describe('::remove', () => {
    test('SUCCESS - remove existing link between user and role', async () => {
      try {
        const result = await rolesInterface.remove(
          { role: Role.VISITOR, userId: 1, organisationId: 1 });
        expect(result).toEqual(expect.objectContaining(
          { access_role_id: 1,
            organisation_id: 1,
            user_account_id: 1,
          }));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('ERROR - throws error if no link between user and role exists', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.remove({ role: Role.VOLUNTEER, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          'This user is not associated to this role at this organisation');
      }
    });
  });

  describe('::move', () => {
    test('SUCCESS - deleted old role and adds new one', async () => {
      await rolesInterface.move(
        { to: Role.VOLUNTEER, from: Role.VISITOR, userId: 1, organisationId: 1 });
      const result = await knex('user_account_access_role').select();
      expect(result[0]).toEqual(expect.objectContaining({
        access_role_id: 2,
        organisation_id: 1,
        user_account_id: 1,
      }));
    });

    test('ERROR - throws error if from entry doesn\'t exist', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.move(
          { to: Role.VOLUNTEER, from: Role.VOLUNTEER_ADMIN, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual('From role is not associated associated to this user');
      }
    });

    test('ERROR - throws error if to entry already exists', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.add({ role: Role.VOLUNTEER, userId: 1, organisationId: 1 });
        await rolesInterface.move(
          { to: Role.VOLUNTEER, from: Role.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          'User is already associated with this \'from\' role at this organistion');
      }
    });
  });

  describe('::removeUserFromAll', () => {
    test('SUCCESS - returns all roles that are deleted', async () => {
      await rolesInterface.add({ role: Role.VOLUNTEER, userId: 1, organisationId: 1 });
      const result = await rolesInterface.removeUserFromAll({ userId: 1, organisationId: 1 });
      expect(result).toEqual(([
        { access_role_id: 1, organisation_id: 1, user_account_id: 1 },
        { access_role_id: 2, organisation_id: 1, user_account_id: 1 },
      ].map(expect.objectContaining)
    ));
    });

    test('ERROR - throws error if user has no roles at organisation', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.removeUserFromAll({ userId: 1, organisationId: 2 });
      } catch (error) {
        expect(error.message).toEqual(
          'This user is not associated to any roles at this organisation');
      }
    });
  });

  describe('::userHas', () => {
    test('SUCCESS - returns true exists object if user has role', async () => {
      const result = await rolesInterface.userHas(
        { userId: 1, role: Role.VISITOR, organisationId: 1 });
      expect(result.exists).toEqual(true);
    });

    test('SUCCESS - returns true exists object if user has role', async () => {
      const result = await rolesInterface.userHas(
        { userId: 1, role: Role.VOLUNTEER, organisationId: 1 });
      expect(result.exists).toEqual(false);
    });
  });

  describe('::getUserRole', () => {
    test('SUCCESS - returns users role id', async () => {
      const result = await rolesInterface.getUserRole({ userId: 1, organisationId: 1 });
      expect(result).toEqual({ access_role_id: 1 });
    });

    test('Error - returns error if userId does not exist', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.getUserRole({ userId: 2, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual('User does not exist');
      }
    });
  });

  describe('::getRolePermissions', () => {
    test('SUCCESS - returns all permissions associated with role', async () => {
      const result = await rolesInterface.getRolePermissions({ roleId: 1 });
      expect(result).toEqual([{
        access_role_id: 1,
        access_type: 'read',
        permission_entity: 'constants',
        permission_id: 1,
        permission_level: 'own' }]);
    });

    test('ERROR - returns error if role id does not exist', async () => {
      expect.assertions(1);
      try {
        await rolesInterface.getRolePermissions({ roleId: 10  });
      } catch (error) {
        expect(error.message).toEqual('Role does not exist or has no associated permissions');
      }
    });
  });
});
