import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { getTrx } from '../../../../../tests/utils/database';
import { Credentials as StandardCredentials } from '../../../../auth/strategies/standard';
import { ExternalCredentials, name as ExtName } from '../../../../auth/strategies/external';
import { injectCfg } from '../../../../../tests/utils/inject';


describe('API v1 :: Community Businesses :: Visit Log Aggregates', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let cbAdmin: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  let extCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    cbAdmin = await Users.getOne(server.app.knex, { where: { id: 2 } });
    organisation = await Organisations.getOne(server.app.knex, { where: { id: 1 } });
    credentials = await StandardCredentials.create(knex, cbAdmin, organisation);
    extCreds = await ExternalCredentials.get(knex, 'aperture-token');
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
      const res = await server.inject(injectCfg({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates',
        credentials,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({});
    });

    test(':: get aggregated visit logs with one field', async () => {
      const res = await server.inject(injectCfg({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates?'
          + 'fields[0]=visitActivity',
        credentials,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({
        visitActivity: { 'Free Running': 7, 'Wear Pink': 4 },
      });
    });

    test(':: get aggregated visit logs with all fields', async () => {
      const res = await server.inject(injectCfg({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates?'
          + 'fields[0]=visitActivity&'
          + 'fields[1]=age&'
          + 'fields[2]=gender',
        credentials,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({
        age: { '18-34': 10, null: 1 },
        gender: { female: 11 },
        visitActivity: { 'Free Running': 7, 'Wear Pink': 4 },
      });
    });

    test(':: unsupported field returns error', async () => {
      const res = await server.inject(injectCfg({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates?'
          + 'fields[0]=lightspeed',
        credentials,
      }));

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toEqual('lightspeed are not supported aggregate fields');
    });

    test(':: accessible via external strategy', async () => {
      const res = await server.inject(injectCfg({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-logs/aggregates?'
          + 'fields[0]=visitActivity',
        credentials: extCreds,
        strategy: ExtName,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({
        visitActivity: { 'Free Running': 7, 'Wear Pink': 4 },
      });
    });
  });
});
