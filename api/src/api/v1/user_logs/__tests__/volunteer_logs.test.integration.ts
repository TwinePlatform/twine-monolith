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
    const until = moment().utc().add(5, 'minute').toISOString();
    const since = moment().utc().subtract(5, 'day').add(5, 'minute').toISOString();
    const res = await server.inject({
      method: 'GET',
      url: `/v1/volunteer-logs?since=${since}&until=${until}`,
      credentials: {
        role: RoleEnum.TWINE_ADMIN,
        scope: ['volunteer_logs-child:read'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(5);
    expect((<any> res.result).result).toEqual(expect.arrayContaining([
      {
        activity: 'Office support',
        duration: { minutes: 50, seconds: 59 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
        userName: 'Emma Emmerich',
      },
      {
        activity: 'Committee work, AGM',
        duration: { hours: 1, seconds: 20 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
        userName: 'Emma Emmerich',
      },
      {
        activity: 'Support and Care for vulnerable community members',
        duration: { minutes: 10, seconds: 20 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
        userName: 'Emma Emmerich',
      },
      {
        activity: 'Office support',
        duration: { minutes: 30 },
        organisationId: 1,
        organisationName: 'Aperture Science',
        userId: 6,
        userName: 'Emma Emmerich',
      },
      {
        activity: 'Office support',
        duration: { minutes: 30 },
        organisationId: 2,
        organisationName: 'Black Mesa Research',
        userId: 6,
        userName: 'Emma Emmerich',
      },
    ].map(expect.objectContaining)));
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

