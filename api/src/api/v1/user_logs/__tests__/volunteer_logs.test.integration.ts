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

  test('success :: returns subset of logs with date querystring', async () => {
    const today = moment();
    const until = today.clone().format('YYYY-MM-DD');
    const since = today.clone().subtract(5, 'day').format('YYYY-MM-DD');
    const res = await server.inject({
      method: 'GET',
      url: `/v1/volunteer-logs?since=${since}&until=${until}`,
      credentials: {
        role: RoleEnum.TWINE_ADMIN,
        scope: ['volunteer_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(2);
    expect((<any> res.result).result).toEqual([
      {
        activity: 'Office support',
        duration: { minutes: 30 },
        organisationId: 1,
        organisationName: 'Aperture Science',
        userId: 6,
      },
      {
        activity: 'Support and Care for vulnerable community members',
        duration: { minutes: 10, seconds: 20 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
      }].map((x) => expect.objectContaining(x)));
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

