import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getTrx } from '../../../../../tests/utils/database';
import { User, Users, Organisation, Organisations } from '../../../../models';


describe('API /community-businesses/me/volunteer-logs', () => {
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

  describe('POST /users/me/volunteer-logs', () => {
    test('can create log for own user', async () => {
      const when = new Date();

      const resCount1 = await server.inject({
        method: 'GET',
        url: '/v1/users/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-parent:read'],
          user,
          organisation,
        },
      });

      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
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
        url: '/v1/users/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-parent:read'],
          user,
          organisation,
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
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
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

    test('cannot create log for other user', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/2/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
        },
        payload: {
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
        },
      });

      expect(res.statusCode).toBe(404);

      const res2 = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
        },
        payload: {
          userId: 4,
          activity: 'Office support',
          duration: {
            minutes: 20,
            hours: 2,
          },
        },
      });

      expect(res2.statusCode).toBe(400);
    });

    test('cannot create log for other organisation', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteer-logs',
        credentials: {
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
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
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
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
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
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
          scope: ['volunteer_logs-parent:write'],
          user,
          organisation,
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
});
