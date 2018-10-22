import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import factory from '../../../../../../tests/utils/factory';
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
  describe('POST /users/register/visitors', () => {
    test('user already exists', async () => {
      const user = await factory.build('user');
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Chell',
          gender: 'female',
          birthYear: 1988,
          email: '1498@aperturescience.com',
        },
        credentials: {
          user,
          scope: ['user_details-child:write'],
          role: RoleEnum.CB_ADMIN,
        },
      });

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message).toBe('User with this e-mail already registered');
    });

    test('non-existent community business', async () => {
      const user = await factory.build('user');
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 9352,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
        },
        credentials: {
          user,
          scope: ['user_details-child:write'],
          role: RoleEnum.CB_ADMIN,
        },
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message).toBe('Unrecognised organisation');
    });

    test('no registered CB_ADMIN', async () => {
    /*
     * Organisation 2 (Black Mesa Research) has an CB_ADMIN (Gordon) who is
     * marked as deleted, and therefore will not be fetched from the DB
     */
      const user = await factory.build('user');
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 2,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
        },
        credentials: {
          user,
          scope: ['user_details-child:write'],
          role: RoleEnum.CB_ADMIN,
        },
      });

      expect(res.statusCode).toBe(422);
      expect((<any> res.result).error.message).toBe('No associated admin for this organisation');
    });

    test('happy path', async () => {
      const user = await factory.build('user');
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
        },
        credentials: {
          user,
          scope: ['user_details-child:write'],
          role: RoleEnum.CB_ADMIN,
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
