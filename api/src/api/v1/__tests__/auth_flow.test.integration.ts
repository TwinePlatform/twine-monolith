import * as Hapi from 'hapi';
import { init } from '../../../server';
import { getConfig } from '../../../../config';
import { getCookie } from '../../../utils';


describe('Auth flow', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const cookieName = config.auth.standard.cookie.name;

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('Login', () => {
    test('CB login from elsewhere :: full session', async () => {
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
    });
  });

  describe('Header authorisation', () => {
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
      expect(typeof resLogin.headers['set-cookie']).toBe('undefined');
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
