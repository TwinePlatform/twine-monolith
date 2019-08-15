import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { getConfig } from '../../../../config';
import { init, getCookie } from '../../../../tests/utils/server';
import { getTrx } from '../../../../tests/utils/database';
import { delay } from 'twine-util/time';


describe('Authentication integration', () => {
  let server: Hapi.Server;
  let _knex: Knex;
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const cookieName = config.auth.schema.session_cookie.options.name;

  beforeAll(async () => {
    server = await init(config);
    _knex = server.app.knex;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(async () => {
    trx = await getTrx(_knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = _knex;
  });

  describe('Cookie authentication', () => {
    test('CB login -> access -> logout', async () => {
      const { app: { knex } } = server;

      // 0. Try to access resource X -> 401
      const resPreAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
      });
      await delay(10); // waiting for user session record to be updated

      const recordsPreAccess = await knex('user_session_record').select('*');

      expect(resPreAccess.statusCode).toBe(401);
      expect(resPreAccess.headers).toHaveProperty('set-cookie');
      expect(recordsPreAccess).toHaveLength(0);

      // 1. Login -> 200
      const resLogin = await server.inject({
        method: 'POST',
        url: '/v1/users/login',
        headers: {
          origin: 'https://data.twine-together.com',
          referrer: 'https://data.twine-together.com/login',
        },
        payload: {
          email: '1@aperturescience.com',
          password: 'CakeisaLi3!',
        },
      });
      await delay(10); // waiting for user session record to be updated

      const recordsLogin = await knex('user_session_record').select('*');

      expect(resLogin.statusCode).toBe(200);
      expect(resLogin.headers).toHaveProperty('set-cookie');
      expect(recordsLogin).toHaveLength(1);
      const token = getCookie(resLogin);

      // 2. Try to access resource X -> 200
      const resAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: {
          referrer: 'https://data.twine-together.com/',
          cookie: `${cookieName}=${token}`,
        },
      });
      await delay(10); // waiting for user session record to be updated

      const recordsAccess = await knex('user_session_record').select('*');

      expect(resAccess.statusCode).toBe(200);
      expect(recordsAccess).toHaveLength(1);
      expect(recordsAccess[0].referrers).toEqual([
        'https://data.twine-together.com/login',
        'https://data.twine-together.com/',
      ]);

      // 3. Logout
      const resLogout = await server.inject({
        method: 'GET',
        url: '/v1/users/logout',
        headers: { cookie: `${cookieName}=${token}` },
      });
      await delay(10); // waiting for user session record to be updated

      const recordsLogout = await knex('user_session_record').select('*');

      expect(resLogout.statusCode).toBe(200);
      expect(recordsLogout).toHaveLength(1);
      expect(recordsLogout[0].referrers).toEqual([
        'https://data.twine-together.com/login',
        'https://data.twine-together.com/',
      ]);
      expect(recordsLogout[0].session_end_type).toEqual('log_out');
      expect(recordsLogout[0].ended_at).not.toBe(null);

      // 4. Try to access resource X -> 401
      const resPostAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: { referrer: 'https://data.twine-together.com/time' },
      });
      await delay(10); // waiting for user session record to be updated

      const recordsPostAccess = await knex('user_session_record').select('*');

      expect(resPostAccess.statusCode).toBe(401);
      expect(recordsPostAccess).toHaveLength(1);
      expect(recordsPostAccess[0].referrers).toEqual([
        'https://data.twine-together.com/login',
        'https://data.twine-together.com/',
      ]);
      expect(recordsPostAccess[0].session_end_type).toEqual('log_out');
      expect(recordsPostAccess[0].ended_at).not.toBe(null);
      expect(recordsPostAccess[0].modified_at).toEqual(recordsLogout[0].modified_at);
    });
  });

  describe('Header authentication', () => {
    test('User login and fetch resource with Authorization header', async () => {
      const { app: { knex } } = server;

      // 1. Login -> 200
      const resLogin = await server.inject({
        method: 'POST',
        url: '/v1/users/login',
        headers: { referrer: 'https://data.twine-together.com/login' },
        payload: {
          type: 'body',
          email: '1@aperturescience.com',
          password: 'CakeisaLi3!',
        },
      });

      expect(resLogin.statusCode).toBe(200);
      const token = (<any> resLogin.result).result.token;

      // 2. Try to access resource X -> 200
      const resAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: {
          Authorization: token,
          referrer: 'https://data.twine-together.com/',
        },
      });

      await delay(10); // waiting for user session record to be updated

      const recordsAccess = await knex('user_session_record').select('*');

      expect(resAccess.statusCode).toBe(200);
      expect(recordsAccess).toHaveLength(1);
      expect(recordsAccess[0].referrers).toEqual([
        'https://data.twine-together.com/login',
        'https://data.twine-together.com/',
      ]);
    });
  });
});
