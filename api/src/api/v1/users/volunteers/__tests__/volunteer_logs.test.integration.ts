import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as moment from 'moment';
import { omit } from 'ramda';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { getTrx } from '../../../../../../tests/utils/database';
import { User, Users, Organisation, Organisations, VolunteerLog } from '../../../../../models';


describe('API /users/me/volunteer-logs', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
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

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  describe('GET /users/me/volunteers-logs', () => {
    test('can get own logs', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
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
        url: `/v1/users/volunteers/me/volunteer-logs?since=${since}&until=${until}`,
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
        url: `/v1/users/volunteers/me/volunteer-logs`,
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
        url: '/v1/users/volunteers/me/volunteer-logs/1',
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
        url: '/v1/users/volunteers/me/volunteer-logs/1?fields[]=activity',
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
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user: await Users.getOne(knex, { where: { id: 3 } }),
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /users/me/volunteer-logs/{logId}', () => {
    test('can partial update own log', async () => {
      const resPre = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      const log = <VolunteerLog> (<any> resPre.result).result;

      const res = await server.inject({
        method: 'PUT',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
        payload: {
          activity: 'Committee work, AGM',
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          ...omit(['modifiedAt'], log),
          activity: 'Committee work, AGM',
        }),
      });
      expect((<any> res.result).result.modifiedAt).not.toEqual(log.modifiedAt);
    });

    test('can full update own log', async () => {
      const resPre = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      const log = <VolunteerLog> (<any> resPre.result).result;

      const then = new Date('2018-07-23T10:33:22.122Z');
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
        payload: {
          activity: 'Committee work, AGM',
          duration: {
            hours: 1,
            minutes: 20,
            seconds: 30,
          },
          startedAt: then.toISOString(),
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          ...omit(['modifiedAt'], log),
          activity: 'Committee work, AGM',
          startedAt: then,
          duration: {
            hours: 1,
            minutes: 20,
            seconds: 30,
          },
        }),
      });
      expect((<any> res.result).result.modifiedAt).not.toEqual(log.modifiedAt);
    });

    test('cannot re-assign log to another user', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
        payload: {
          userId: 2,
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('cannot re-assign log to another organisation', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
        payload: {
          organisationId: 1,
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('cannot update other user\'s log', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user: await Users.getOne(knex, { where: { id: 3 } }),
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
        payload: {
          activity: 'Committee work, AGM',
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /users/me/volunteer-logs', () => {
    test('can mark own volunteer log as deleted', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });

      const res2 = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res2.statusCode).toBe(404);

      const res3 = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          user,
          organisation,
          scope: ['volunteer_logs-parent:read'],
        },
      });

      expect(res3.statusCode).toBe(200);
      expect((<any> res3.result).result).toHaveLength(6);
      expect((<any> res3.result).result.map((x: any) => x.id)).not.toContain(1);
    });

    test('cannot mark other user\'s volunteer log as deleted', async () => {
      const otherUser = await Users.getOne(trx, { where: { id: 3 } });
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/users/volunteers/me/volunteer-logs/1',
        credentials: {
          user: otherUser,
          organisation,
          scope: ['volunteer_logs-parent:write'],
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /users/volunteers/me/volunteer-logs/aggregates', () => {
    test('can get own aggregates', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs/aggregates',
        credentials: {
          scope: ['volunteer_logs-parent:read'],
          user,
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          total: {
            seconds: 59,
            minutes: 1,
            hours: 10,
          },
        }),
      });
    });

    test('can get own aggregates between dates', async () => {
      const then = moment().day(-6).utc().startOf('day').toISOString();
      const now = moment().day(-4).utc().endOf('day').toISOString();

      const res = await server.inject({
        method: 'GET',
        url: `/v1/users/volunteers/me/volunteer-logs/aggregates?since=${then}&until=${now}`,
        credentials: {
          scope: ['volunteer_logs-parent:read'],
          user,
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: {
          total: {
            seconds: 59,
            minutes: 10,
            hours: 8,
          },
        },
      });
    });

    test('cannot get other users aggregates', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/4/volunteer-logs/aggregates',
        credentials: {
          scope: ['volunteer_logs-parent:read'],
          user,
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
