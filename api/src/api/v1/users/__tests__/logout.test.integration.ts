import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getCookie } from '../../../../utils';
import { getTrx } from '../../../../../tests/utils/database';


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
