import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import * as JWT from 'jsonwebtoken';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
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
    expect((<any> res.result).result.token).toEqual(expect.stringContaining('-')); // UUID
    expect(typeof res.headers['set-cookie']).not.toBe('undefined'); // cookie is still set anyway
  });

  test(':: successful login | type cookie | restricted to single role', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'cookie',
        restrict: 'CB_ADMIN',
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers).toHaveProperty('set-cookie');
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
    // expect(typeof res.headers['set-cookie']).toBe('undefined');
    expect(res.result).toEqual({ error: expect.objectContaining({ statusCode: 403 }) });
  });

  test(':: successful login | type body | restricted to multiple roles', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        type: 'body',
        restrict: ['TWINE_ADMIN', 'CB_ADMIN'],
        email: '1@aperturescience.com',
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(200);
    // expect(typeof res.headers['set-cookie']).toBe('undefined');
    expect((<any> res.result).result.token).toEqual(expect.stringContaining(''));
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
    // expect(typeof res.headers['set-cookie']).toBe('undefined');
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
    // expect(typeof res.headers['set-cookie']).toBe('undefined');
    expect(res.result).toEqual({ error: expect.objectContaining({ statusCode: 400 }) });
  });

  test(':: unsuccessful login | type body | mismatched role', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/login',
      payload: {
        restrict: ['VOLUNTEER'],
        email: '1498@aperturescience.com', // This is VISITOR!
        password: 'CakeisaLi3!',
      },
    });

    expect(res.statusCode).toBe(403);
    // expect(typeof res.headers['set-cookie']).not.toBe('undefined');
    expect(res.result).toEqual({
      error: expect.objectContaining({
        statusCode: 403,
        message: 'User does not have required role',
      }),
    });
  });
});
