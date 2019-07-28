/*
 * API functional tests
 */
import * as Hapi from '@hapi/hapi';
import * as moment from 'moment';
import { assocPath } from 'ramda';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import { User, Organisation, Users, Organisations } from '../../../../models';
import { Credentials as StandardCredentials } from '../../../../auth/strategies/standard';
import { RoleEnum } from '../../../../models/types';
import { injectCfg } from '../../../../../tests/utils/inject';


describe('GET /volunteer-logs', () => {
  let server: Hapi.Server;
  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);

    user = await Users.getOne(server.app.knex, { where: { name: 'Big Boss' } });
    organisation =
      await Organisations.getOne(server.app.knex, { where: { name: 'Aperture Science' } });
    credentials = await StandardCredentials.get(server.app.knex, user, organisation);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('success :: returns all logs', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/v1/volunteer-logs',
      credentials,
    }));

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(9);
  });

  test('success :: returns subset of logs with date querystring', async () => {
    const until = moment().utc().add(5, 'minute').toISOString();
    const since = moment().utc().subtract(5, 'day').add(5, 'minute').toISOString();
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: `/v1/volunteer-logs?since=${since}&until=${until}`,
      credentials,
    }));

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
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/v1/volunteer-logs',
      credentials: assocPath(['user', 'roles'], [RoleEnum.FUNDING_BODY], credentials),
    }));

    expect(res.statusCode).toBe(403);
  });
});

