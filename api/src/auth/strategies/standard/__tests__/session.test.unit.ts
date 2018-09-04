import * as Hapi from 'hapi';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import { SessionManager } from '../session';


describe('Auth Strategy Standard :: SessionManager', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(
      config,
      {
        routes: [{
          method: 'GET',
          path: '/startSession',
          handler: async (request, h) => {
            return SessionManager.create(request, h.response({}), { userId: 1, organisationId: 1 });
          },
        }],
      }
    );
  });

  afterAll(async () => {
    await server.stop();
  });

  test('', async () => {
  });
});
