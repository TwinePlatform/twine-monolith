/*
 * User API functional tests
 */
import * as Knex from 'knex';
import routes from '..';
import { init } from '../../../../../tests/server';
import { getConfig } from '../../../../../config';

describe('API /users', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  describe('GET /users', () => {
    test('happy path', async () => {
      const server = await init(config, { routes, knex });

      const res = await server.inject({ method: 'GET', url: '/users' });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Chell',
            email: '1498@aperturescience.com',
            postCode: '49829',
            birthYear: 1988,
            gender: 'female',
            disability: 'no',
            ethnicity: 'prefer not to say',
            isEmailConfirmed: false,
            isEmailConsentGranted: false,
            isPhoneNumberConfirmed: false,
            isSMSConsentGranted: false,
            deletedAt: null,
            modifiedAt: null,
          }),

          expect.objectContaining({
            id: 4,
            name: 'Barney',
            email: '2305@blackmesaresearch.com',
            postCode: '82394',
            birthYear: 1974,
            gender: 'male',
            disability: 'no',
            ethnicity: 'prefer not to say',
            isEmailConfirmed: false,
            isEmailConsentGranted: false,
            isPhoneNumberConfirmed: false,
            isSMSConsentGranted: false,
            deletedAt: null,
            modifiedAt: null,
          }),
        ]),
      });
    });
  });
});
