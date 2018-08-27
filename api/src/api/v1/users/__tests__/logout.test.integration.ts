import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getCookie } from '../../../../utils';
const { migrate } = require('../../../../../database');


describe('GET /users/logout', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  afterEach(async () => {
    await migrate.truncate({ client: server.app.knex });
    await server.app.knex.seed.run();
  });

  test(':: successful logout', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/logout',
      credentials: {
        scope: ['access'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers).toHaveProperty('set-cookie');
    expect(getCookie(res)).toEqual('');
  });
});
