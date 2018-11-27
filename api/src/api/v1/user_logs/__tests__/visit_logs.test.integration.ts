/*
 * API functional tests
 */
import * as Hapi from 'hapi';
import { init } from '../../../../server';
import * as moment from 'moment';
import { getConfig } from '../../../../../config';
import { RoleEnum } from '../../../../auth/types';

describe('GET /visit-logs', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('success :: returns all logs', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/visit-logs',
      credentials: {
        role: RoleEnum.TWINE_ADMIN,
        scope: ['visit_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.arrayContaining([
      { category: 'Sports', gender: 'female', id: 1, visitActivity: 'Free Running' },
      { category: 'Sports', gender: 'female', id: 2, visitActivity: 'Free Running' },
      { category: 'Sports', gender: 'female', id: 3, visitActivity: 'Free Running' },
      { category: 'Sports', gender: 'female', id: 4, visitActivity: 'Free Running' },
      { category: 'Sports', gender: 'female', id: 5, visitActivity: 'Free Running' },
      { category: 'Sports', gender: 'female', id: 6, visitActivity: 'Free Running' },
      { category: 'Sports', gender: 'female', id: 7, visitActivity: 'Free Running' },
      { category: 'Socialising', gender: 'female', id: 8, visitActivity: 'Wear Pink' },
      { category: 'Socialising', gender: 'female', id: 9, visitActivity: 'Wear Pink' },
      { category: 'Socialising', gender: 'female', id: 10, visitActivity: 'Wear Pink' }]
      .map((x) => expect.objectContaining(x))
    ));
  });

  test('success :: returns subset of logs with date querystring', async () => {
    const today = moment();
    const until = today.clone().format('YYYY-MM-DD');
    const since = today.clone().subtract(1, 'day').format('YYYY-MM-DD');
    const res = await server.inject({
      method: 'GET',
      url: `/v1/visit-logs?since=${since}&until=${until}`,
      credentials: {
        role: RoleEnum.TWINE_ADMIN,
        scope: ['visit_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.arrayContaining([
      {
        birthYear: 1988,
        category: 'Socialising',
        gender: 'female',
        id: 8,
        organisationName: 'Aperture Science',
        userId: 1,
        visitActivity: 'Wear Pink',
      },
      {
        birthYear: 1988,
        category: 'Sports',
        gender: 'female',
        id: 7,
        organisationName: 'Aperture Science',
        userId: 1,
        visitActivity: 'Free Running',
      }]
      .map((x) => expect.objectContaining(x))
    ));
  });

  test('failure :: funding body cannot access as not implemented', async () => {
    const res = await server.inject({
      method: 'GET',
      url: `/v1/visit-logs`,
      credentials: {
        role: RoleEnum.FUNDING_BODY,
        scope: ['visit_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(403);
  });
});

