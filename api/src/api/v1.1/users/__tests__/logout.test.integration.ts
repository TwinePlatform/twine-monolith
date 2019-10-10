import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { init, getCookie } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import { getTrx } from '../../../../../tests/utils/database';
import { injectCfg } from '../../../../../tests/utils/inject';


describe('GET /users/logout', () => {
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

  test(':: successful logout', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/v1/users/logout',
      credentials: {},
    }));

    expect(res.statusCode).toBe(200);
    expect(res.headers).toHaveProperty('set-cookie');
    // Session is terminated server side, client keeps cookie
    expect(getCookie(res)).toEqual(expect.stringContaining('Fe'));
  });
});
