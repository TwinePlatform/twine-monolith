import * as Hapi from '@hapi/hapi';
import { getConfig } from '../../../../config';
import { init, getCookie } from '../../../../tests/utils/server';


describe('Authentication integration', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const cookieName = config.auth.standard.session_cookie.options.name;

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('Cookie authentication', () => {
    test('CB login -> access -> logout', async () => {
      // 0. Try to access resource X -> 401
      const resPreAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
      });

      expect(resPreAccess.statusCode).toBe(401);

      // 1. Login -> 200
      const resLogin = await server.inject({
        method: 'POST',
        url: '/v1/users/login',
        headers: { origin: 'https://dashboard.twine-together.com' },
        payload: {
          email: '1@aperturescience.com',
          password: 'CakeisaLi3!',
        },
      });

      expect(resLogin.statusCode).toBe(200);
      expect(resLogin.headers).toHaveProperty('set-cookie');
      const token = getCookie(resLogin);

      // 2. Try to access resource X -> 200
      const resAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: { cookie: `${cookieName}=${token}` },
      });

      expect(resAccess.statusCode).toBe(200);

      // 3. Logout
      const resLogout = await server.inject({
        method: 'GET',
        url: '/v1/users/logout',
        headers: { cookie: `${cookieName}=${token}` },
      });

      expect(resLogout.statusCode).toBe(200);

      // 4. Try to access resource X -> 401
      const resPostAccess = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
      });

      expect(resPostAccess.statusCode).toBe(401);
    });
  });

  describe('Header authentication', () => {
    test('User login and fetch resource with Authorization header', async () => {
      // 1. Login -> 200
      const resLogin = await server.inject({
        method: 'POST',
        url: '/v1/users/login',
        headers: { origin: 'https://dashboard.twine-together.com' },
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
        headers: { Authorization: token },
      });

      expect(resAccess.statusCode).toBe(200);
    });
  });
});
