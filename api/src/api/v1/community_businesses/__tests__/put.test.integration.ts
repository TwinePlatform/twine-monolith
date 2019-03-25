import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { Organisation, Organisations, User, Users } from '../../../../models';
import { getTrx } from '../../../../../tests/utils/database';
import { StandardCredentials } from '../../../../auth/strategies/standard';


describe('PUT /community-businesses', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let user: User;
  let admin: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  let adminCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    admin = await Users.getOne(knex, { where: { name: 'Big Boss' } });
    organisation = await Organisations.getOne(knex, { where: { name: 'Aperture Science' } });
    credentials = await StandardCredentials.get(knex, user, organisation);
    adminCreds = await StandardCredentials.get(knex, admin, organisation);
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

  describe('PUT /community-businesses/me', () => {
    test('can update own community business', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me',
        payload: {
          name: 'CRAPerture Sciences',
          sector: 'Housing',
        },
        credentials,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          name: 'CRAPerture Sciences',
          sector: 'Housing',
        }),
      });
    });

    test('cannot update own community business w/ unrecognised region', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me',
        payload: {
          region: 'Narnia',
        },
        credentials,
      });

      expect(res.statusCode).toBe(400);
    });

    test('cannot update own community business w/ unrecognised sector', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me',
        payload: {
          sector: 'Hedge Fund',
        },
        credentials,
      });

      expect(res.statusCode).toBe(400);
    });

    test.skip('updating address updates coordinates', async () => {});
    test.skip('updating post code updates coordinates', async () => {});
  });

  describe('PUT /community-businesses/:id', () => {
    test('can update child community business', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/1',
        payload: {
          name: 'CRAPerture Sciences',
          sector: 'Housing',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          name: 'CRAPerture Sciences',
          sector: 'Housing',
        }),
      });
    });

    test('can update casing of child community business name', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/1',
        payload: {
          name: 'aperture sciences',
          sector: 'Housing',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          name: 'aperture sciences',
          sector: 'Housing',
        }),
      });
    });

    test('cannot update non-child community business', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/1',
        payload: {
          sector: 'Hedge Fund',
        },
        credentials,
      });

      expect(res.statusCode).toBe(403);
    });

    test('cannot update own community business w/ unrecognised region', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/1',
        payload: {
          region: 'Narnia',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(400);
    });

    test('cannot update own community business w/ unrecognised sector', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/1',
        payload: {
          sector: 'Hedge Fund',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(400);
    });

    test('cannot update own temporary community business', async () => {

      const resCreate = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/register/temporary',
        credentials: adminCreds,
        payload: { orgName: 'Shinra Electric Power Company' },
      });
      expect(resCreate.statusCode).toBe(200);
      const { communityBusiness: tempCb } = (<any> resCreate.result).result;
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/community-businesses/${tempCb.id}`,
        payload: {
          name: 'Not Temp',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(403);
    });

    test.skip('updating child community business address updates coordinates', async () => {});
    test.skip('updating child community business post code updates coordinates', async () => {});
  });
});
