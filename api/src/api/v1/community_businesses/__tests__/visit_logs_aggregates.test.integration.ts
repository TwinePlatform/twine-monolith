import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { getTrx } from '../../../../../tests/utils/database';
import { StandardCredentials } from '../../../../auth/strategies/standard';


describe('API v1 :: Community Businesses :: Visit Log Aggregates', () => {
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
    credentials = await StandardCredentials.get(knex, cbAdmin, organisation);
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

  describe('GET', () => {
    test(':: no fields returns empty response', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates',
        credentials,
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({});
    });

    test(':: get aggregated visit logs with field', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates?'
          + 'fields[0]=visitActivity',
        credentials,
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({
        visitActivity: { 'Free Running': 7, 'Wear Pink': 3 },
      });
    });

    test(':: unsupported field returns error', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates?'
          + 'fields[0]=lightspeed',
        credentials,
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toEqual('lightspeed are not supported aggregate fields');
    });
  });
});
