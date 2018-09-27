import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as JWT from 'jsonwebtoken';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getCookie } from '../../../../utils';
import { getTrx } from '../../../../../tests/utils/database';


describe('POST /users/login', () => {
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
    server.app.knex = knex;
  });

  test(':: successful login | default type (cookie) | unrestricted', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
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

  test(':: successful login | type body | unrestricted', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'body',
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers).not.toHaveProperty('set-cookie');
    expect(JWT.verify((<any> res.result).result.token, secret, verifyOptions))
      .toEqual(expect.objectContaining({
        userId: 2,
        organisationId: 1,
      }));
  });

  test(':: successful login | type cookie | restricted to single role', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'cookie',
        restrict: 'ORG_ADMIN',
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

  test(':: unsuccessful login | type cookie | restricted to single role', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'cookie',
        restrict: 'VOLUNTEER',
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(403);
    expect(res.headers).not.toHaveProperty('set-cookie');
    expect(res.result).toEqual({ error: expect.objectContaining({ statusCode: 403 }) });
  });

  test(':: successful login | type body | restricted to multiple roles', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'body',
        restrict: ['TWINE_ADMIN', 'ORG_ADMIN'],
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers).not.toHaveProperty('set-cookie');
    expect(JWT.verify((<any> res.result).result.token, secret, verifyOptions))
      .toEqual(expect.objectContaining({
        userId: 2,
        organisationId: 1,
      }));
  });

  test(':: unsuccessful login | type body | restricted to multiple roles', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'body',
        restrict: ['VOLUNTEER', 'VOLUNTEER_ADMIN'],
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(403);
    expect(res.headers).not.toHaveProperty('set-cookie');
    expect(res.result).toEqual({ error: expect.objectContaining({ statusCode: 403 }) });
  });

  test(':: unsuccessful login | type body | invalid role', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        restrict: ['VOLUNTEER', 'LOL'],
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(400);
    expect(res.headers).not.toHaveProperty('set-cookie');
    expect(res.result).toEqual({ error: expect.objectContaining({ statusCode: 400 }) });
  });
});
