/*
 * API functional tests
 */
import * as Hapi from 'hapi';
import { init } from '../../../../server';
import * as moment from 'moment';
import { getConfig } from '../../../../../config';
import { RoleEnum } from '../../../../auth/types';

describe('GET /volunteer-logs', () => {
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
      url: '/v1/volunteer-logs',
      credentials: {
        role: RoleEnum.TWINE_ADMIN,
        scope: ['volunteer_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(9);
  });

  test.only('success :: returns subset of logs with date querystring', async () => {
    const until = moment().utc().startOf('day').toISOString();
    const since = moment().utc().subtract(5, 'day').startOf('day').toISOString();

    const res = await server.inject({
      method: 'GET',
      url: `/v1/volunteer-logs?since=${since}&until=${until}`,
      credentials: {
        role: RoleEnum.TWINE_ADMIN,
        scope: ['volunteer_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(4);
    expect((<any> res.result).result).toEqual([
      {
        activity: 'Outdoor and practical work',
        duration: { hours: 5 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
      },
      {
        activity: 'Office support',
        duration: { minutes: 50, seconds: 59 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
      },
      {
        activity: 'Committee work, AGM',
        duration: { hours: 1, seconds: 20 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
      },
      {
        activity: 'Support and Care for vulnerable community members',
        duration: { minutes: 10, seconds: 20 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
      },
    ].map(expect.objectContaining));
  });

  test('failure :: funding body cannot access as not implemented', async () => {
    const res = await server.inject({
      method: 'GET',
      url: `/v1/volunteer-logs`,
      credentials: {
        role: RoleEnum.FUNDING_BODY,
        scope: ['volunteer_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(403);
  });
});

