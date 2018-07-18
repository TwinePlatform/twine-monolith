import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/factory';
import { Users } from '..';
const { migrate } = require('../../../database');


describe('User Model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  describe('Read', () => {
    beforeEach(async () => {
      await migrate.truncate({ client: knex });
      await knex.seed.run();
    });

    test('get :: no arguments gets all users non-deleted users', async () => {
      const users = await Users.get(knex);

      expect(users.length).toBe(1);
      expect(users[0]).toEqual(expect.objectContaining({
        name: 'Chell',
        gender: 'female',
        disability: 'no',
        ethnicity: 'prefer not to say',
        email: '1498@aperturescience.com',
        birthYear: 1988,
        isEmailConfirmed: false,
      }));
    });

    test('get :: filter users by ID | non-existent ID resolves to empty array', async () => {
      const users = await Users.get(knex, { id: 5 });
      expect(users).toEqual([]);
    });

    test('get :: get deleted users only when specifically asked for', async () => {
      const users = await Users.get(knex, { deletedAt: { lt: '', gt: '' } });
    });
  });

  describe('Write', () => {
    beforeEach(async () => {
      await migrate.truncate({ client: knex });
      await knex.seed.run();
    });

    test('update :: successful update of non-foreign-key column', async () => {
      const user = await Users.getOne(knex, { id: 1 });
      const changes = { name: 'GLaDOS' };
      const omitter = omit(['name', 'modifiedAt']);

      const updatedUser = await Users.update(knex, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.name).toBe(changes.name);
    });

    test('update :: successful update of foreign-key column', async () => {
      const user = await Users.getOne(knex, { id: 1 });
      const changes = { gender: 'male' };
      const omitter = omit(['gender', 'modifiedAt']);

      const updatedUser = await Users.update(knex, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.gender).toBe('male');
    });

    test('add :: create a new record using minimal information', async () => {
      const changeset = await factory.build('user');

      const user = await Users.add(knex, changeset);

      expect(user).toEqual(expect.objectContaining({
        ...changeset,
        gender: 'prefer not to say',
        ethnicity: 'prefer not to say',
        disability: 'prefer not to say',
      }));
    });

    test('destroy :: remove existing record', async () => {
      const users = await Users.get(knex);

      await Users.destroy(knex, users[0]);

      const usersAfterDel = await Users.get(knex);
      const deletedUser = await Users.get(knex, users[0]);

      expect(users.length).toBe(usersAfterDel.length + 1);
      expect(deletedUser).toEqual([]);
    });
  });
});
