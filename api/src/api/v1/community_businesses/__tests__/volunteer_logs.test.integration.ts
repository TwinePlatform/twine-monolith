import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as moment from 'moment';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getTrx } from '../../../../../tests/utils/database';
import { User, Users, Organisation, Organisations, VolunteerLog } from '../../../../models';
import { RoleEnum } from '../../../../auth';


describe('API /community-businesses/me/volunteer-logs', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let user: User;
  let volAdmin: User;
  let cbAdmin: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'Emma Emmerich' } });
    volAdmin = await Users.getOne(knex, { where: { name: 'Raiden' } });
    cbAdmin = await Users.getOne(knex, { where: { name: 'Gordon' } });
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

  describe('GET /community-businesses/me/volunteer-logs', () => {
    test('can get own organisations logs as VOLUNTEER_ADMIN', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-sibling:read'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(8);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({ duration: { hours: 5 } }),
        ]),
      });
    });

    test('can get own organisations logs as ORG_ADMIN', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-child:read'],
          user: cbAdmin,
          organisation,
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(8);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({ duration: { hours: 5 } }),
        ]),
      });
    });

    test('cannot get own organisations logs as VOLUNTEER', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(403);
    });

    test('can get own organisations logs between dates', async () => {
      const until = moment().day(-3);
      const res = await server.inject({
        method: 'GET',
        url: `/v1/community-businesses/me/volunteer-logs?until=${until.toISOString()}`,
        credentials: {
          scope: ['volunteer_logs-sibling:read'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(6);
      expect(
        (<any> res.result).result
          .map((l: VolunteerLog) => l.startedAt)
          .every((d: Date) => d <= until.toDate()))
      .toBe(true);

    });
  });

  describe('GET /community-businesses/me/volunteer-logs/:id', () => {
    test('cannot get own volunteer log as VOLUNTEER', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/2',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(403);
    });

    test('can get other volunteer\'s log as VOLUNTEER_ADMIN', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/2',
        credentials: {
          scope: ['volunteer_logs-sibling:read'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 2,
          activity: 'Community outreach and communications',
          duration: { hours: 2, minutes: 20 },
        }),
      });
    });

    test('can get other volunteer\'s log as ORG_ADMIN', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/2',
        credentials: {
          scope: ['volunteer_logs-child:read'],
          user: cbAdmin,
          organisation,
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 2,
          activity: 'Community outreach and communications',
          duration: { hours: 2, minutes: 20 },
        }),
      });
    });

    test('cannot get other volunteer\'s log as VOLUNTEER', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/9',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(403);
    });

    test('cannot get non-existent log', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/142',
        credentials: {
          scope: ['volunteer_logs-sibling:read'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(404);
    });

    test('cannot get existing log from other organisation', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/8',
        credentials: {
          scope: ['volunteer_logs-sibling:read'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /community-businesses/me/volunteer-logs/:id', () => {
    test('can partially update other users log', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/volunteer-logs/2',
        credentials: {
          scope: ['volunteer_logs-sibling:write'],
          role: RoleEnum.VOLUNTEER_ADMIN,
          user: volAdmin,
          organisation,
        },
        payload: {
          activity: 'Other',
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({ id: 2, activity: 'Other' }),
      });
    });

    test('can fully update other users log', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/volunteer-logs/2',
        credentials: {
          scope: ['volunteer_logs-sibling:write'],
          role: RoleEnum.VOLUNTEER_ADMIN,
          user: volAdmin,
          organisation,
        },
        payload: {
          activity: 'Other',
          duration: { minutes: 17 },
          startedAt: '2017-12-22T22:14:23.000Z',
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 2,
          activity: 'Other',
          duration: { minutes: 17 },
          startedAt: new Date('2017-12-22T22:14:23.000Z'),
        }),
      });
    });

    test('can update logs as ORG_ADMIN', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/volunteer-logs/2',
        credentials: {
          scope: ['volunteer_logs-child:write'],
          role: RoleEnum.ORG_ADMIN,
          user: cbAdmin,
          organisation,
        },
        payload: {
          activity: 'Other',
          duration: { minutes: 17 },
          startedAt: '2017-12-22T22:14:23.000Z',
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 2,
          activity: 'Other',
          duration: { minutes: 17 },
          startedAt: new Date('2017-12-22T22:14:23.000Z'),
        }),
      });
    });

    test('cannot update logs of different organisation', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/volunteer-logs/8',
        credentials: {
          scope: ['volunteer_logs-child:write'],
          role: RoleEnum.ORG_ADMIN,
          user: cbAdmin,
          organisation,
        },
        payload: {
          activity: 'Other',
          duration: { minutes: 17 },
          startedAt: '2017-12-22T22:14:23.000Z',
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /community-businesses/me/volunteer-logs/:id', () => {
    test('can mark other users log as deleted as VOLUNTEER_ADMIN', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/volunteer-logs/3',
        credentials: {
          scope: ['volunteer_logs-sibling:delete'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });

      const resGet = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/3',
        credentials: {
          scope: ['volunteer_logs-sibling:read'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(resGet.statusCode).toBe(404);
    });

    test('can mark other users log as deleted as ORG_ADMIN', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/volunteer-logs/3',
        credentials: {
          scope: ['volunteer_logs-child:delete'],
          user: cbAdmin,
          organisation,
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });

      const resGet = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/3',
        credentials: {
          scope: ['volunteer_logs-child:read'],
          user: cbAdmin,
          organisation,
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(resGet.statusCode).toBe(404);
    });

    test('cannot mark other users log as deleted as VOLUNTEER', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/volunteer-logs/3',
        credentials: {
          scope: ['volunteer_logs-own:delete'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(403);
    });

    test('cannot mark other users log as deleted from different organisation', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/volunteer-logs/8',
        credentials: {
          scope: ['volunteer_logs-sibling:delete'],
          user: volAdmin,
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /community-businesses/me/volunteer-logs', () => {
    test('can create log for own user', async () => {
      const when = new Date();

      const resCount1 = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: {
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
          startedAt: when.toISOString(),
        },
      });

      const resCount2 = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          userId: 6,
          organisationId: 2,
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
          startedAt: when,
        }),
      });
      expect((<any> resCount1.result).result.length)
        .toBe((<any> resCount2.result).result.length - 1);

    });

    test('creating log without start date defaults to "now"', async () => {
      const before = new Date();

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: {
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
        },
      });

      const after = new Date();

      expect(res.statusCode).toEqual(200);
      expect((<any> res.result).result.startedAt.valueOf()).toBeGreaterThan(before.valueOf());
      expect((<any> res.result).result.startedAt.valueOf()).toBeLessThan(after.valueOf());
    });

    test('can create log for other user if admin at CB', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-sibling:write'],
          user: await Users.getOne(knex, { where: { name: 'Raiden' } }),
          organisation,
          role: RoleEnum.VOLUNTEER_ADMIN,
        },
        payload: {
          userId: user.id,
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
        },
      });

      expect(res.statusCode).toEqual(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          userId: user.id,
          organisationId: organisation.id,
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
        }),
      });
    });

    test('cannot create log for other user if not admin at CB', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user: await Users.getOne(knex, { where: { name: 'Chell' } }),
          organisation,
        },
        payload: {
          userId: user.id,
          activity: 'Office support',
          duration: { minutes: 20, hours: 2 },
        },
      });

      expect(res.statusCode).toBe(403);
    });

    test('cannot create log for other organisation', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: {
          organisationId: 1,
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('non-existent activity', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: {
          activity: 'LOLOLOLOLOL',
          duration: {
            minutes: 20,
            hours: 2,
          },
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('malformed duration', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: {
          activity: 'Office support',
          duration: {
            foo: 20,
          },
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('negative duration', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: {
          activity: 'Office support',
          duration: {
            minutes: -1,
          },
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /community-businesses/me/volunteer-logs/summary', () => {
    test('can get own summaries as VOLUNTEER', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/summary',
        credentials: {
          scope: ['organisations_details-parent:read'],
          user,
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: {
          volunteers: 2,
          volunteeredTime: {
            hours: 10,
            minutes: 36,
            seconds: 59,
          },
        },
      });
    });

    test('can get own summaries as ORG_ADMIN', async () => {
      const cbAdmin = await Users.getOne(trx, { where: { name: 'Gordon' } });

      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteer-logs/summary',
        credentials: {
          scope: ['organisations_details-own:read'],
          user: cbAdmin,
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: {
          volunteers: 2,
          volunteeredTime: {
            hours: 10,
            minutes: 36,
            seconds: 59,
          },
        },
      });
    });

    test('cannot get other orgs summaries', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/3/volunteer-logs/summary',
        credentials: {
          scope: ['organisations_details-own:read'],
          user,
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /community-businesses/me/volunteer-logs/sync', () => {
    test('can sync single log', async () => {
      const logs = [{
        activity: 'Office support',
        duration: { minutes: 20 },
      }];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs/sync',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: logs,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });

      const resLogs = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(resLogs.statusCode).toBe(200);
      expect((<any> resLogs.result).result).toHaveLength(8);
    });

    test('can sync multiple logs', async () => {
      const times = ['2018-09-22T21:02:10', '2018-09-21T21:01:12', '2018-10-02T21:02:10'];
      const logs = [
        { activity: 'Office support', duration: { minutes: 20 }, startedAt: times[0] },
        { activity: 'Other', duration: { hours: 2 }, startedAt: times[1] },
        { activity: 'Shop/Cafe work', duration: { minutes: 50, seconds: 2 }, startedAt: times[2] },
      ];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs/sync',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: logs,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });

      const resLogs = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(resLogs.statusCode).toBe(200);
      expect((<any> resLogs.result).result).toHaveLength(10);
    });

    test('empty array in payload does nothing', async () => {
      const logs: any[] = [];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs/sync',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: logs,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });

      const resLogs = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(resLogs.statusCode).toBe(200);
      expect((<any> resLogs.result).result).toHaveLength(7);
    });

    test('fails when trying to sync logs w/ identical "startedAt" in payload', async () => {
      const now = new Date().toISOString();
      const logs = [
        { activity: 'Office support', duration: { minutes: 20 }, startedAt: now },
        { activity: 'Office support', duration: { minutes: 20 }, startedAt: now },
      ];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs/sync',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: logs,
      });

      expect(res.statusCode).toBe(400);

      const resLogs = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(resLogs.statusCode).toBe(200);
      expect((<any> resLogs.result).result).toHaveLength(7);
    });

    test('fails when trying to sync logs w/ same "startedAt" as existing log', async () => {
      const resLogs = await server.inject({
        method: 'GET',
        url: '/v1/users/volunteers/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
      });

      expect(resLogs.statusCode).toBe(200);
      expect((<any> resLogs.result).result).toHaveLength(7);

      const { startedAt } = (<any> resLogs.result).result[0];

      const logs = [
        { activity: 'Office support', duration: { minutes: 20 }, startedAt },
      ];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs/sync',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          user,
          organisation,
          role: RoleEnum.VOLUNTEER,
        },
        payload: logs,
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
