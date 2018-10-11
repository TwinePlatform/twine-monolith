/*
 * User API functional tests
 */
import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getTrx } from '../../../../../tests/utils/database';
import { CommunityBusinesses } from '../../../../models';
import { RegionEnum, SectorEnum } from '../../../../models/types';

describe('API /users', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  let trx: Knex.Transaction;

  beforeAll(async () => {
    server = await init(config);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
    await server.shutdown(true);
  });

  describe('GET /regions/:id/community-businesses', () => {
    test(':: success - returns list of all cbs in region', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/regions/3/community-businesses',
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(
        [{ id: 1, name: 'Aperture Science' }, { id: 2, name: 'Black Mesa Research' }]);
    });

    test(':: success - returns empty list of unpopulated region', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/regions/1/community-businesses',
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual([]);
    });

    test(':: fail - returns 404 for nonexisting region', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/regions/100/community-businesses',
      });

      expect(res.statusCode).toBe(404);
    });

    test(':: success - returns list in alphabetical order', async () => {
      await CommunityBusinesses.add(trx, {
        name: 'Zeldas Dungeon',
        region: RegionEnum.LONDON,
        sector: SectorEnum.COMMUNITY_HUB,
      });
      await CommunityBusinesses.add(trx, {
        name: 'Okamis Fields',
        region: RegionEnum.LONDON,
        sector: SectorEnum.ENVIRONMENT,
      });

      const res = await server.inject({
        method: 'GET',
        url: '/v1/regions/3/community-businesses',
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
