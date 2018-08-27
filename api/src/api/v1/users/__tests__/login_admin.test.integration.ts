import * as Hapi from 'hapi';
import * as JWT from 'jsonwebtoken';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getCookie } from '../../../../utils';
const { migrate } = require('../../../../../database');


describe('POST /users/login/admin', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const { auth: { standard: { jwt: { secret, verifyOptions } } } } = config;

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
