import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Users, GenderEnum } from '..';


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

      expect(users.length).toBe(5);
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
        .toEqual(['Barney', 'Big Boss', 'Chell', 'GlaDos', 'Gordon']);
    });

    test('get :: offset results', async () => {
      const users = await Users.get(trx, { offset: 3, order: ['id', 'asc'] });
      expect(users.length).toBe(2);
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

    test('add :: create a new record using minimal information', async () => {
      const changeset = await factory.build('user');

      const user = await Users.add(trx, changeset);

      expect(user).toEqual(expect.objectContaining({
        ...changeset,
        gender: 'prefer not to say',
        ethnicity: 'prefer not to say',
        disability: 'prefer not to say',
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
});

