import * as Knex from 'knex';
import Roles from '..';
import { RoleEnum } from '../../types';
import { getConfig } from '../../../../config';
import { getTrx } from '../../../../tests/utils/database';
import { Users } from '../../../models';
import factory from '../../../../tests/utils/factory';


describe('Roles Module', () => {
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('::add', () => {
    test('SUCCESS - adds role for a user', async () => {
      try {
        const result = await Roles.add(trx, {
          role: RoleEnum.VOLUNTEER,
          userId: 4,
          organisationId: 1,
        });

        expect(result).toEqual(expect.objectContaining({
          access_role_id: 2,
          organisation_id: 1,
          user_account_id: 4,
        }));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('SUCCESS - can add second role for a user', async () => {
      try {
        const result = await Roles.add(trx, {
          role: RoleEnum.VOLUNTEER,
          userId: 1,
          organisationId: 1,
        });

        expect(result).toEqual(expect.objectContaining({
          access_role_id: 2,
          organisation_id: 1,
          user_account_id: 1,
        }));
      } catch (error) {
        expect(error).toBeFalsy();
      }
    });

    test('ERROR - throws error if user/role link exists', async () => {
      expect.assertions(1);
      try {
        await Roles.add(trx, { role: RoleEnum.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message)
          .toBe(
            'Constraint violation: user_account_access_role_unique_row\n' +
            'Tried to associate User 1 with role VISITOR at organistion 1');
      }
    });

    test('ERROR - throws error if user id does not exists', async () => {
      expect.assertions(1);
      try {
        await Roles.add(trx, { role: RoleEnum.VISITOR, userId: 45, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          /* tslint:disable */
          `Foreign key does not exist: Key (user_account_id)=(45) is not present in table \"user_account\".`
          /* tslint:enable */
        );
      }
    });

    test('ERROR - throws if user already has same role at same organisation', async () => {
      expect.assertions(1);

      try {
        await Roles.add(trx, { role: RoleEnum.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message)
          .toEqual(
            'Constraint violation: user_account_access_role_unique_row\n' +
            'Tried to associate User 1 with role VISITOR at organistion 1'
          );
      }
    });
  });

  describe('::remove', () => {
    test('SUCCESS - remove existing link between user and role', async () => {
      try {
        const result = await Roles.remove(trx,
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
        await Roles.remove(trx, { role: RoleEnum.VOLUNTEER, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          'User 1 is not associated with role VOLUNTEER at organisation 1');
      }
    });
  });

  describe('::move', () => {
    test('SUCCESS - deleted old role and adds new one', async () => {
      await Roles.move(trx,
        { to: RoleEnum.VOLUNTEER, from: RoleEnum.VISITOR, userId: 1, organisationId: 1 });

      const [result] = await trx('user_account_access_role')
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
        await Roles.move(trx,
          { to: RoleEnum.VOLUNTEER, from: RoleEnum.VOLUNTEER_ADMIN, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual('"from" role VOLUNTEER_ADMIN is not associated with user 1');
      }
    });

    test('ERROR - throws error if "to" entry already exists', async () => {
      expect.assertions(1);
      try {
        await Roles.add(trx, { role: RoleEnum.VOLUNTEER, userId: 1, organisationId: 1 });
        await Roles.move(trx,
          { to: RoleEnum.VOLUNTEER, from: RoleEnum.VISITOR, userId: 1, organisationId: 1 });
      } catch (error) {
        expect(error.message).toEqual(
          'Constraint violation: user_account_access_role_unique_row\n' +
          'Tried to associate User 1 with role VOLUNTEER at organistion 1');
      }
    });
  });

  describe('::userHas', () => {
    test('SUCCESS - returns true if user has role', async () => {
      const user = await Users.getOne(trx, { where: { name: 'Chell' } });
      const result = await Roles.userHas(trx, user, RoleEnum.VISITOR);
      expect(result).toEqual(true);
    });

    test('SUCCESS - returns false if user does not have role', async () => {
      const user = await Users.getOne(trx, { where: { name: 'GlaDos' } });
      const result = await Roles.userHas(trx, user, RoleEnum.VOLUNTEER);
      expect(result).toEqual(false);
    });

    test('SUCCESS - returns true if user has one of many roles', async () => {
      const user = await Users.getOne(trx, { where: { name: 'turret' } });
      const result = await Roles.userHas(trx, user, RoleEnum.VOLUNTEER_ADMIN);
      expect(result).toEqual(true);
    });

    test('SUCCESS - returns false if user has none of many roles', async () => {
      const user = await Users.getOne(trx, { where: { name: 'turret' } });
      const result = await Roles.userHas(trx, user, RoleEnum.CB_ADMIN);
      expect(result).toEqual(false);
    });
  });

  describe('::userHasAtCb', () => {
    test('SUCCESS - returns true if user has role', async () => {
      const result = await Roles.userHasAtCb(trx,
        { userId: 1, role: RoleEnum.VISITOR, organisationId: 1 });
      expect(result).toEqual(true);
    });

    test('SUCCESS - returns false if user does not have role', async () => {
      const result = await Roles.userHasAtCb(trx,
        { userId: 1, role: RoleEnum.VOLUNTEER, organisationId: 1 });
      expect(result).toEqual(false);
    });

    test('SUCCESS - returns true if user has one of many roles', async () => {
      const result = await Roles.userHasAtCb(trx,
        { userId: 1, role: [RoleEnum.CB_ADMIN, RoleEnum.VISITOR], organisationId: 1 });
      expect(result).toEqual(true);
    });

    test('SUCCESS - returns false if user has none of many roles', async () => {
      const result = await Roles.userHasAtCb(trx,
        { userId: 1, role: [RoleEnum.CB_ADMIN, RoleEnum.TWINE_ADMIN], organisationId: 1 });
      expect(result).toEqual(false);
    });
  });

  describe('::fromUser', () => {
    test('returns array of one role', async () => {
      const user = await Users.getOne(trx, { where: { id: 3 } });
      const roles = await Roles.fromUser(trx, user);
      expect(roles).toEqual([{ organisationId: 2, role: RoleEnum.CB_ADMIN }]);
    });

    test('returns array of multiple roles if user has multiple roles at org', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      await Roles.add(trx, { userId: 1, organisationId: 1, role: RoleEnum.VOLUNTEER });
      const roles = await Roles.fromUser(trx, user);
      expect(roles).toEqual([
        { organisationId: 1, role: RoleEnum.VISITOR },
        { organisationId: 1, role: RoleEnum.VOLUNTEER },
      ]);
    });

    test('returns empty array if no roles are found', async () => {
      const changeset = await factory.build('user');
      const user = await Users.add(trx, changeset);
      const roles = await Roles.fromUser(trx, user);
      expect(roles).toEqual([]);
    });
  });

  describe('::fromUserWithOrg', () => {
    test('returns array of one role if only one role at org', async () => {
      const roles = await Roles.fromUserWithOrg(trx, { userId: 1, organisationId: 1 });
      expect(roles).toEqual([RoleEnum.VISITOR]);
    });

    test('returns array of multiple roles if user has multiple roles at org', async () => {
      await Roles.add(trx, { userId: 1, organisationId: 1, role: RoleEnum.VOLUNTEER });
      const roles = await Roles.fromUserWithOrg(trx, { userId: 1, organisationId: 1 });
      expect(roles).toEqual([RoleEnum.VISITOR, RoleEnum.VOLUNTEER]);
    });

    test('returns empty array if no roles are found', async () => {
      const roles = await Roles.fromUserWithOrg(trx, { userId: 4, organisationId: 2 });
      expect(roles).toEqual([]);
    });

    test('throws if user ID does not exist', async () => {
      expect.assertions(1);

      try {
        await Roles.fromUserWithOrg(trx, { userId: 20000, organisationId: 1 });
      } catch (error) {
        expect(error.message).toBe('User with ID 20000 does not exist');
      }
    });

    test('throws if organisation ID does not exist', async () => {
      expect.assertions(1);

      try {
        await Roles.fromUserWithOrg(trx, { userId: 1, organisationId: -1 });
      } catch (error) {
        expect(error.message).toBe('Organisation with ID -1 does not exist');
      }
    });
  });
});
