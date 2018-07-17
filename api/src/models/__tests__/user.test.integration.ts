import * as Knex from 'knex';
import { getConfig } from '../../../config';
import { Users } from '..';


describe('User Model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  test('get :: no arguments gets all users', async () => {
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
    const users = await Users.get(knex, { id: 2 });
    expect(users).toEqual([]);
  });
});
