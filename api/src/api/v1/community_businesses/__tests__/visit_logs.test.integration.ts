import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { getTrx } from '../../../../../tests/utils/database';
import { Credentials } from '../../../../auth/strategies/standard';


describe('API v1 :: Community Businesses :: Visit Logs', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let cbAdmin: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    cbAdmin = await Users.getOne(server.app.knex, { where: { id: 2 } });
    organisation = await Organisations.getOne(server.app.knex, { where: { id: 1 } });
    credentials = await Credentials.get(server.app.knex, cbAdmin, organisation);
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
          visitActivityId: 2,
        },
        credentials,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({ userId: 1, visitActivityId: 2 }),
      });
    });

    test(':: user from another cb returns error', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-logs',
        payload: {
          userId: 2,
          visitActivityId: 2,
        },
        credentials,
      });

      expect(res.statusCode).toBe(403);
      expect((<any> res.result).error.message)
        .toBe('Visitor is not registered at Community Business');
    });

    test(':: incorrect activity id returns error', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-logs',
        payload: {
          userId: 1,
          visitActivityId: 200,
        },
        credentials,
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toBe('Activity not associated to Community Business');
    });
  });

  describe('GET', () => {
    test(':: get all visit logs for a cb', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs',
        credentials,
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
        credentials,
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
