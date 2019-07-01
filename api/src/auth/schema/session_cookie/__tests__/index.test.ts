import { Server } from '@hapi/hapi';
import * as Cookie from 'cookie';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import plugin from '..';


describe('"session_id" Auth Schema', () => {
  describe('Schema', () => {
    let server: Server;

    beforeEach(async () => {
      server = await init(getConfig(process.env.NODE_ENV));
      const password = '2109345u986y17041093574974123543trefrg';
      await server.register({ plugin, options: { cookieOptions: { password } } });
    });

    test('can register strategy against schema', async () => {
      server.auth.strategy('foo', 'session_id', { validate: jest.fn() });
    });

    test('no session id present', async () => {
      const validate = jest.fn();

      server.auth.strategy('foo', 'session_id', { validate, cookieHeader: 'blah' });

      server.route({
        method: 'GET',
        path: '/',
        options: { auth: { strategy: 'foo' } },
        handler: async (req, h) => req.yar.id,
      });

      const res = await server.inject({
        method: 'GET',
        url: '/',
      });

      expect(res.statusCode).toBe(401);
      expect(validate).toHaveBeenCalledTimes(0);
    });

    test('session id present in cookie', async () => {
      const validate = jest.fn(() => ({ isValid: true, credentials: {} }));

      server.auth.strategy('foo', 'session_id', { validate, cookieHeader: 'blah' });

      server.route([{
        method: 'GET',
        path: '/',
        options: { auth: { strategy: 'foo' } },
        handler: async (req, h) => req.yar.id,
      }, {
        method: 'GET',
        path: '/login',
        options: { auth: false },
        handler: async (req, h) => {
          req.yar.set('foo', 'bar');
          return h.response(null);
        },
      }]);

      const res = await server.inject({
        method: 'GET',
        url: '/',
      });

      expect(res.statusCode).toBe(401);
      expect(validate).toHaveBeenCalledTimes(0);
    });
  });
});
