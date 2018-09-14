import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { RoleEnum } from '../../../../auth/types';
import { getTrx } from '../../../../../tests/utils/database';


describe('API v1 :: Community Businesses :: Visit Logs', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let cbAdmin: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    cbAdmin = await Users.getOne(server.app.knex, { where: { id: 2 } });
    organisation = await Organisations.getOne(server.app.knex, { where: { id: 1 } });
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

  describe('POST', () => {
    test(':: successfully add new visit log', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-logs',
        payload: {
          userId: 1,
          qrCode: 'chellsqrcode',
          visitActivityId: 2,
        },
        credentials: {
          user: cbAdmin,
          organisation,
          scope: ['visit_logs-own:write'],
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({ userId: 1, visitActivityId: 2 }),
      });
    });

    test(':: invalid QR code returns 400', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-logs',
        payload: {
          userId: 1,
          qrCode: 'thisisnotmyqrcode',
          activityId: 2,
        },
        credentials: {
          user: cbAdmin,
          organisation,
          scope: ['visit_logs-own:write'],
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET', () => {
    test(':: get all visit logs for a cb', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs',
        credentials: {
          user: cbAdmin,
          organisation,
          scope: ['visit_logs-own:read'],
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).meta).toEqual({ total: 10 });
      expect((<any> res.result).result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            visitActivity: 'Free Running',
            birthYear: 1988,
            category: 'Sports',
            gender: 'female',
            id: 1,
            userId: 1}),
        ]));
    });

    test(':: filtered visit logs with query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs?'
        + '&filter[visitActivity]=Wear%20Pink',
        credentials: {
          user: cbAdmin,
          organisation,
          scope: ['visit_logs-own:read'],
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).meta).toEqual({ total: 3 });
      expect((<any> res.result).result).toEqual(
        expect.arrayContaining([
          (<any> expect).not.objectContaining({
            visitActivity: 'Free Running',
            category: 'Sports',
          }),
        ]));
    });
  });
});
