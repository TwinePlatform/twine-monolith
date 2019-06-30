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
      await server.register({ plugin, options: { password } });
    });

    test('can register strategy against schema', async () => {
      server.auth.strategy('foo', 'session_id', { validate: jest.fn() });
    });

    test('can', async () => {
      const validate = jest.fn(() => ({ isValid: true, credentials: {} }));

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
        headers: {
          cookie: Cookie.serialize('blah', 'boo'),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(typeof res.payload).toBe('string');
      expect(validate).toHaveBeenCalledTimes(1);
    });
  });
});
