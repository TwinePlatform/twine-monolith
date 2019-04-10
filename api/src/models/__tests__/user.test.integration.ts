import * as Knex from 'knex';
import { compare } from 'bcrypt';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Users, GenderEnum } from '..';
import { CommunityBusinesses } from '../community_business';
import Roles from '../role';
import { RoleEnum } from '../types';


describe('User Model', () => {
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

  describe('Read', () => {
    test('get :: no arguments gets all users', async () => {
      const users = await Users.get(trx);

      expect(users.length).toBe(9);
      expect(users).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Chell',
          gender: 'female',
          disability: 'no',
          ethnicity: 'prefer not to say',
          email: '1498@aperturescience.com',
          birthYear: 1988,
          isEmailConfirmed: false,
        }),
      ]));
    });

    test('get :: filter users by ID | non-existent ID resolves to empty array', async () => {
      const users = await Users.get(trx, { where: { id: 500 } });
      expect(users).toEqual([]);
    });

    test('get :: get deleted users', async () => {
      const users = await Users.get(trx, { whereNot: { deletedAt: null } });
      expect(users).toEqual([
        expect.objectContaining({
          id: 3,
          name: 'Gordon',
        }),
      ]);
    });

    test('get :: limit results', async () => {
      const users = await Users.get(trx, { limit: 1 });
      expect(users.length).toBe(1);
    });

    test('get :: order results', async () => {
      const users = await Users.get(trx, { order: ['name', 'desc'] });
      expect(users.map((u) => u.name).sort())
        .toEqual([
          'Barney',
          'Big Boss',
          'Chell',
          'Companion Cube',
          'Emma Emmerich',
          'GlaDos',
          'Gordon',
          'Raiden',
          'Turret',
        ]);
    });

    test('get :: offset results', async () => {
      const users = await Users.get(trx, { offset: 3, order: ['id', 'asc'] });
      expect(users.length).toBe(6);
      expect(users[0].name).toBe('Barney');
    });

    test('exists :: returns true for existent user', async () => {
      const exists = await Users.exists(knex, { where: { name: 'Gordon' } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent user', async () => {
      const exists = await Users.exists(knex, { where: { name: 'foo' } });
      expect(exists).toBe(false);
    });

  });

  describe('Write', () => {
    test('update :: successful update of non-foreign-key column', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      const changes = { name: 'GLaDOS' };
      const omitter = omit(['name', 'modifiedAt']);

      const updatedUser = await Users.update(trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.name).toBe(changes.name);
    });

    test('update :: successful update of foreign-key column', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      const changes = { gender: GenderEnum.MALE };
      const omitter = omit(['gender', 'modifiedAt']);

      const updatedUser = await Users.update(trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.gender).toBe('male');
    });

    test('update :: can update password', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      const changes = { password: 'Foooo!oo2o3r' };
      const omitter = omit(['password', 'modifiedAt']);

      const updatedUser = await Users.update(trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(await compare(changes.password, updatedUser.password)).toBe(true);
    });

    test('add :: create a new record using minimal information', async () => {
      const changeset = await factory.build('user');

      const user = await Users.add(trx, changeset);
      const passwordCheck = await compare(changeset.password, user.password);

      expect(user).toEqual(expect.objectContaining({
        ...omit(['password'], changeset),
        gender: 'prefer not to say',
        ethnicity: 'prefer not to say',
        disability: 'prefer not to say',
      }));
      expect(passwordCheck).toBeTruthy();
    });

    test('add :: cannot create record with deleted gender', async () => {
      expect.assertions(2);

      const changeset = await factory.build('volunteer');
      const res = await trx('gender')
        .update({ deleted_at: new Date() })
        .where({ gender_name: changeset.gender });

      expect(res).toBe(1);

      try {
        await Users.add(trx, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('add :: cannot create record with deleted disability', async () => {
      expect.assertions(2);

      const changeset = await factory.build('volunteer');
      const res = await trx('disability')
        .update({ deleted_at: new Date() })
        .where({ disability_name: changeset.disability });

      expect(res).toBe(1);

      try {
        await Users.add(trx, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('add :: cannot create record with deleted ethnicity', async () => {
      expect.assertions(2);

      const changeset = await factory.build('volunteer');
      const res = await trx('ethnicity')
        .update({ deleted_at: new Date() })
        .where({ ethnicity_name: changeset.ethnicity });

      expect(res).toBe(1);

      try {
        await Users.add(trx, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('add :: can create record with optional age', async () => {
      const changeset = await factory.build('user');
      changeset.birthYear = null;

      const user = await Users.add(trx, changeset);

      expect(user).toEqual(expect.objectContaining({
        ...omit(['password'], changeset),
      }));
    });

    test('destroy :: mark existing record as deleted', async () => {
      const users = await Users.get(trx, { where: { deletedAt: null } });

      await Users.destroy(trx, users[0]);
      const usersAfterDel = await Users.get(trx, { where: { deletedAt: null } });
      const deletedUsers = await Users.get(trx, { whereNot: { deletedAt: null } });
      const deletedUser = await Users.getOne(trx, { where: { id: users[0].id } });

      expect(users.length).toBe(usersAfterDel.length + 1);
      expect(deletedUsers).toEqual(expect.arrayContaining([
        expect.objectContaining(
          {
            ...omit(['deletedAt', 'modifiedAt'], users[0]),
            email: null,
            name: 'none',
            phoneNumber: null,
            postCode: null,
            qrCode: null,
            isEmailConfirmed: false,
            isPhoneNumberConfirmed: false,
            isEmailConsentGranted: false,
            isSMSConsentGranted: false,
          }
        ),
      ]));
      expect(deletedUser.modifiedAt).not.toEqual(users[0].modifiedAt);
      expect(deletedUser.deletedAt).not.toEqual(null);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const user = await Users.getOne(knex);

      const serialised = await Users.serialise(user);

      expect(serialised).toEqual(omit(['password', 'qrCode'], user));
    });
  });

  describe('addActiveDayEvent', () => {
    test('::SUCCESS - adds an event for a user', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });

      // check no event exists
      const eventCheck = await trx('user_account_active_day')
        .where({ user_account_id: user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck).toHaveLength(0);

      // insert event
      await Users.addActiveDayEvent(trx, user, 'localhost:101');

      // check event is inserted
      const eventCheck2 = await trx('user_account_active_day')
        .where({ user_account_id: user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck2).toHaveLength(1);
      expect(eventCheck2).toEqual([expect.objectContaining({
        user_account_id: 1,
        origin: 'localhost:101',
      })]);
    });

    test('::SUCCESS - adds only 1 event per day for a user', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });

      // check no event exists
      const eventCheck = await trx('user_account_active_day')
        .where({ user_account_id: user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck).toHaveLength(0);

      // insert event x 2
      await Users.addActiveDayEvent(trx, user, 'localhost:101');
      await Users.addActiveDayEvent(trx, user, 'localhost:101');

      // check event is inserted
      const eventCheck2 = await trx('user_account_active_day')
        .where({ user_account_id: user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck2).toHaveLength(1);
      expect(eventCheck2).toEqual([expect.objectContaining({
        user_account_id: 1,
        origin: 'localhost:101',
      })]);
    });

    test('::SUCCESS - separate events stored for a different origin', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });

      // check no event exists
      const eventCheck = await trx('user_account_active_day')
        .where({ user_account_id: user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck).toHaveLength(0);

      // insert event x 2
      await Users.addActiveDayEvent(trx, user, 'localhost:101');
      await Users.addActiveDayEvent(trx, user, 'localhost:202');

      // check event is inserted
      const eventCheck2 = await trx('user_account_active_day')
        .where({ user_account_id: user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck2).toHaveLength(2);
      expect(eventCheck2).toEqual([
        expect.objectContaining({
          user_account_id: 1,
          origin: 'localhost:101',
        }),
        expect.objectContaining({
          user_account_id: 1,
          origin: 'localhost:202',
        }),
      ]);
    });
  });

  describe('isMemberOf', () => {
    test('::SUCCESS - returns true if user has a role at cb', async () => {
      const user = await Users.getOne(trx, { where: { name: 'Glados' } });
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'aperture science' } });
      const check = await Users.isMemberOf(trx, user, cb);
      expect(check).toBe(true);
    });

    test('::SUCCESS - returns false if user has a role at cb', async () => {
      const user = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'aperture science' } });
      const check = await Users.isMemberOf(trx, user, cb);
      expect(check).toBe(false);
    });

    test('::SUCCESS - returns false if user has roles at multiple cbs', async () => {
      // roles at multiple cbs is not currently supported
      const user = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'aperture science' } });
      const cb2 = await CommunityBusinesses.getOne(trx, { where: { name: 'black mesa research' } });
      await Roles.add(trx, { userId: user.id, organisationId: cb.id, role: RoleEnum.VISITOR });
      const check = await Users.isMemberOf(trx, user, cb2);
      expect(check).toBe(false);
    });
  });
});

