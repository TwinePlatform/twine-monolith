import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as JWT from 'jsonwebtoken';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getCookie } from '../../../../utils';
import { getTrx } from '../../../../../tests/utils/database';


describe('POST /users/login/admin', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const { auth: { standard: { jwt: { secret, verifyOptions } } } } = config;

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
  });

  test(':: successful login', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login/admin',
      payload: {
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers).toHaveProperty('set-cookie');
    expect(JWT.verify(getCookie(res), secret, verifyOptions))
      .toEqual(expect.objectContaining({
        userId: 2,
        organisationId: 1,
      }));
  });
});
