import * as Knex from 'knex';
import { omit, Dictionary } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/factory';
import { getTrx } from '../../../tests/database';
import { Users } from '..';


describe('User Model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);
  const context: Dictionary<any> = {};

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    await getTrx(context, knex);
  });

  afterEach(async () => {
    await context.trx.rollback();
  });

  describe('Read', () => {
    test('get :: no arguments gets all users', async () => {
      const users = await Users.get(context.trx);

      expect(users.length).toBe(4);
      expect(users).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Chell',
          gender: 'female',
          disability: 'no',
          ethnicity: 'prefer not to say',
          email: '1498@aperturescience.com',
          birthYear: 1988,
          isEmailConfirmed: false,
        })
      ]));
    });

    test('get :: filter users by ID | non-existent ID resolves to empty array', async () => {
      const users = await Users.get(context.trx, { where: { id: 5 } });
      expect(users).toEqual([]);
    });

    test('get :: get deleted users', async () => {
      const users = await Users.get(context.trx, { whereNot: { deletedAt: null } });
      expect(users).toEqual([
        expect.objectContaining({
          id: 3,
          name: 'Gordon',
        }),
      ]);
    });

    test('get :: limit results', async () => {
      const users = await Users.get(context.trx, { limit: 1 });
      expect(users.length).toBe(1);
    });

    test('get :: order results', async () => {
      const users = await Users.get(context.trx, { order: ['name', 'desc'] });
      expect(users.map((u) => u.name)).toEqual(['Gordon', 'GlaDos', 'Chell', 'Barney']);
    });

    test('get :: offset results', async () => {
      const users = await Users.get(context.trx, { offset: 3, order: ['id', 'asc'] });
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Barney');
    });
  });

  describe('Write', () => {
    test('update :: successful update of non-foreign-key column', async () => {
      const user = await Users.getOne(context.trx, { where: { id: 1 } });
      const changes = { name: 'GLaDOS' };
      const omitter = omit(['name', 'modifiedAt']);

      const updatedUser = await Users.update(context.trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.name).toBe(changes.name);
    });

    test('update :: successful update of foreign-key column', async () => {
      const user = await Users.getOne(context.trx, { where: { id: 1 } });
      const changes = { gender: 'male' };
      const omitter = omit(['gender', 'modifiedAt']);

      const updatedUser = await Users.update(context.trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.gender).toBe('male');
    });

    test('add :: create a new record using minimal information', async () => {
      const changeset = await factory.build('user');

      const user = await Users.add(context.trx, changeset);

      expect(user).toEqual(expect.objectContaining({
        ...changeset,
        gender: 'prefer not to say',
        ethnicity: 'prefer not to say',
        disability: 'prefer not to say',
      }));
    });

    test('destroy :: mark existing record as deleted', async () => {
      const users = await Users.get(context.trx);

      await Users.destroy(context.trx, users[0]);

      const usersAfterDel = await Users.get(context.trx, { where: { deletedAt: null } });
      const deletedUser = await Users.get(context.trx, { where: users[0] });

      expect(users.length).toBe(usersAfterDel.length + 1);
      expect(deletedUser).toEqual([]);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const user = await Users.getOne(knex);

      const serialised = Users.serialise(user);

      expect(serialised).toEqual(omit(['password', 'qrCode'], user));
    });

    test('deserialise :: inverse of serialise', async () => {
      const user = await Users.getOne(knex);

      const unchanged = Users.deserialise(Users.serialise(user));

      expect(unchanged).toEqual(omit(['password', 'qrCode'], user));
    });
  });
});

