import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as moment from 'moment';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';


describe.only('API /users/me/volunteer-logs', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let user: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'Emma Emmerich' } });
    organisation = await Organisations.getOne(knex, { where: { name: 'Black Mesa Research' } });
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /users/me/volunteers-logs', () => {
    test('can get own logs', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/me/volunteer-logs',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(7);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({
            organisationId: organisation.id,
            userId: user.id,
            duration: { minutes: 30 },
          }),
        ]),
      });
    });

    test('can get own logs filtered by date', async () => {
      const since = moment().day(-6).toDate().toISOString();
      const until = moment().day(-5).toDate().toISOString();

      const res = await server.inject({
        method: 'GET',
        url: `/v1/users/me/volunteer-logs?since=${since}&until=${until}`,
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(1);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({
            organisationId: organisation.id,
            userId: user.id,
            activity: 'Outdoor and practical work',
            duration: { hours: 5 },
          }),
        ]),
      });
    });

    test('can get no logs for non-volunteer', async () => {
      const res = await server.inject({
        method: 'GET',
        url: `/v1/users/me/volunteer-logs`,
        credentials: {
          user: await Users.getOne(knex, { where: { id: 1 } }),
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(0);
    });
  });

  describe('GET /users/me/volunteer-logs/{logId}', () => {
    test('can get own volunteer log', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 1,
          organisationId: organisation.id,
          userId: user.id,
          duration: { minutes: 10, seconds: 20 },
          activity: 'Helping with raising funds (shop, events…)',
        }),
      });
    });

    test('can filter fields of own volunteer log', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/me/volunteer-logs/1?fields[]=activity',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: { activity: 'Helping with raising funds (shop, events…)' },
      });
    });

    test('cannot get other users volunteer log', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/me/volunteer-logs/1',
        credentials: {
          user: await Users.getOne(knex, { where: { id: 3 } }),
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
