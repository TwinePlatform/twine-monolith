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

  describe('Escalation', () => {
    test('CB login from elsewhere :: full session', async () => {
      // 1. Login ("restricted") -> 200
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

    test('CB login from visitor :: escalate session :: de-escalate session', async () => {
      let token: string;

      // 1. Login ("restricted") -> 200
      const resLogin = await server.inject({
        method: 'POST',
        url: '/v1/users/login',
        headers: { origin: 'https://visitor.twine-together.com' },
        payload: {
          email: '1@aperturescience.com',
          password: 'CakeisaLi3!',
        },
      });

      expect(resLogin.statusCode).toBe(200);
      expect(resLogin.headers).toHaveProperty('set-cookie');
      token = getCookie(resLogin);

      // 2. Try to access resource X -> 403
      const resAccess1 = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: { cookie: `${cookieName}=${token}` },
      });

      expect(resAccess1.statusCode).toBe(403);

      // 3. Escalate session ("full") -> 200
      const resEscalate = await server.inject({
        method: 'POST',
        url: '/v1/users/login/escalate',
        headers: { cookie: `${cookieName}=${token}` },
        payload: { password: 'CakeisaLi3!' },
      });

      expect(resEscalate.statusCode).toBe(200);
      expect(resEscalate.headers).toHaveProperty('set-cookie');
      token = getCookie(resEscalate);

      // 4. Try to access resource X -> 200
      const resAccess2 = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: { cookie: `${cookieName}=${token}` },
      });

      expect(resAccess2.statusCode).toBe(200);

      // 5. De-escalate session ("restricted") -> 200
      const resDeescalate = await server.inject({
        method: 'POST',
        url: '/v1/users/login/de-escalate',
        headers: { cookie: `${cookieName}=${token}` },
      });

      expect(resDeescalate.statusCode).toBe(200);
      expect(resDeescalate.headers).toHaveProperty('set-cookie');
      token = getCookie(resDeescalate);

      // 6. Try to access resource X -> 403
      const resAccess3 = await server.inject({
        method: 'GET',
        url: '/v1/users/me',
        headers: { cookie: `${cookieName}=${token}` },
      });

      expect(resAccess3.statusCode).toBe(403);
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
