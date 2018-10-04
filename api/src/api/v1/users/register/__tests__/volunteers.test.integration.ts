import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { RoleEnum } from '../../../../../auth/types';
import { getTrx } from '../../../../../../tests/utils/database';


describe('API v1 - register new users', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });
  describe('POST /users/register/volunteers', () => {
    test(':: fail - user already exists', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/volunteers',
        payload: {
          organisationId: 1,
          name: 'Chell',
          gender: 'female',
          birthYear: 1988,
          email: '1498@aperturescience.com',
          password: 'c<3mpanionCube',
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message).toBe('User with this e-mail already registered');
    });

    test(':: fail - non-existent community business', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/volunteers',
        payload: {
          organisationId: 9352,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
          password: 'fighteS1994!',
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message).toBe('Unrecognised organisation');
    });

    test(':: success - create VOLUNTEER', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/volunteers',
        payload: {
          organisationId: 1,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
          password: 'fighteS1994!',
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        name: 'foo',
        gender: 'female',
        birthYear: 1988,
        email: '13542@google.com',
      }));
    });

    test(':: success - create VOLUNTEER_ADMIN', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/volunteers',
        payload: {
          organisationId: 1,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
          password: 'fighteS1994!',
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        name: 'foo',
        gender: 'female',
        birthYear: 1988,
        email: '13542@google.com',
      }));
    });
  });
});
