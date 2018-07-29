import * as knexInit from 'knex';
import { Dictionary } from 'ramda';
import Roles from '..';
import { RoleEnum } from '../../types';
import { getConfig } from '../../../../config';
import { getTrx } from '../../../../tests/database';


describe('Roles Module', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = knexInit(config.knex);
  const context: Dictionary<any> = {};

  beforeEach(async () => {
    await getTrx(context, knex);
  });

  afterEach(async () => {
    await context.trx.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('::add', () => {
    test('SUCCESS - adds role for a user', async () => {
      try {
        const result = await Roles.add(context.trx,
          { role: RoleEnum.VOLUNTEER, userId: 1, organisationId: 1 });
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
        await Roles.add(context.trx, { role: RoleEnum.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message)
          .toBe('User 1 is already associated with role VISITOR at organistion 1');
      }
    });

    test('ERROR - throws error if user id does not exists', async () => {
      expect.assertions(1);
      try {
        await Roles.add(context.trx, { role: RoleEnum.VISITOR, userId: 45, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          /* tslint:disable */
          `Foreign key does not exist: Key (user_account_id)=(45) is not present in table \"user_account\".`
          /* tslint:enable */
        );
      }
    });
  });

  describe('::remove', () => {
    test('SUCCESS - remove existing link between user and role', async () => {
      try {
        const result = await Roles.remove(context.trx,
          { role: RoleEnum.VISITOR, userId: 1, organisationId: 1 });
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
        await Roles.remove(context.trx, { role: RoleEnum.VOLUNTEER, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          'User 1 is not associated with role VOLUNTEER at organisation 1');
      }
    });
  });

  describe('::move', () => {
    test('SUCCESS - deleted old role and adds new one', async () => {
      await Roles.move(context.trx,
        { to: RoleEnum.VOLUNTEER, from: RoleEnum.VISITOR, userId: 1, organisationId: 1 });

      const [result] = await context.trx('user_account_access_role')
        .select()
        .where({ user_account_id: 1 });

      expect(result).toEqual(expect.objectContaining({
        access_role_id: 2,
        organisation_id: 1,
        user_account_id: 1,
      }));
    });

    test('ERROR - throws error if "from" entry doesn\'t exist', async () => {
      expect.assertions(1);
      try {
        await Roles.move(context.trx,
          { to: RoleEnum.VOLUNTEER, from: RoleEnum.VOLUNTEER_ADMIN, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual('"from" role VOLUNTEER_ADMIN is not associated with user 1');
      }
    });

    test('ERROR - throws error if "to" entry already exists', async () => {
      expect.assertions(1);
      try {
        await Roles.add(context.trx, { role: RoleEnum.VOLUNTEER, userId: 1, organisationId: 1 });
        await Roles.move(context.trx,
          { to: RoleEnum.VOLUNTEER, from: RoleEnum.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          'User 1 is already associated with role VOLUNTEER at organistion 1');
      }
    });
  });

  describe('::removeUserFromAll', () => {
    test('SUCCESS - returns all roles that are deleted', async () => {
      await Roles.add(context.trx, { role: RoleEnum.VOLUNTEER, userId: 1, organisationId: 1 });
      const result = await Roles.removeUserFromAll(context.trx, { userId: 1, organisationId: 1 });
      expect(result).toEqual(([
        { access_role_id: 1, organisation_id: 1, user_account_id: 1 },
        { access_role_id: 2, organisation_id: 1, user_account_id: 1 },
      ].map(expect.objectContaining)
      ));
    });

    test('ERROR - throws error if user has no roles at organisation', async () => {
      expect.assertions(1);
      try {
        await Roles.removeUserFromAll(context.trx, { userId: 1, organisationId: 2 });
      } catch (error) {
        expect(error.message).toEqual(
          'User 1 is not associated to any roles at organisation 2');
      }
    });
  });

  describe('::userHas', () => {
    test('SUCCESS - returns true exists object if user has role', async () => {
      const result = await Roles.userHas(context.trx,
        { userId: 1, role: RoleEnum.VISITOR, organisationId: 1 });
      expect(result).toEqual(true);
    });

    test('SUCCESS - returns true exists object if user has role', async () => {
      const result = await Roles.userHas(context.trx,
        { userId: 1, role: RoleEnum.VOLUNTEER, organisationId: 1 });
      expect(result).toEqual(false);
    });
  });

  describe('::oneFromUser', () => {
    test('SUCCESS - returns users role id', async () => {
      const result = await Roles.oneFromUser(context.trx, { userId: 1, organisationId: 1 });
      expect(result).toEqual(RoleEnum.VISITOR);
    });

    test('Error - returns error if userId does not exist', async () => {
      expect.assertions(1);
      try {
        await Roles.oneFromUser(context.trx, { userId: 20, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual('User 20 does not exist');
      }
    });
  });
});
