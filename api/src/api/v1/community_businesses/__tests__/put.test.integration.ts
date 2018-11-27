import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { Organisation, Organisations } from '../../../../models';
import { RoleEnum } from '../../../../auth/types';
import { getTrx } from '../../../../../tests/utils/database';


describe('PUT /community-businesses', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    organisation = await Organisations.getOne(knex, { where: { name: 'Aperture Science' } });
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
        credentials: {
          scope: ['organisations_details-own:write'],
          organisation,
        },
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
        credentials: {
          scope: ['organisations_details-own:write'],
          organisation,
        },
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
        credentials: {
          scope: ['organisations_details-own:write'],
          organisation,
        },
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
        credentials: {
          scope: ['organisations_details-child:write'],
          role: RoleEnum.TWINE_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          name: 'CRAPerture Sciences',
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
        credentials: {
          scope: ['organisations_details-child:write'],
          organisation,
        },
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
        credentials: {
          scope: ['organisations_details-child:write'],
          role: RoleEnum.TWINE_ADMIN,
        },
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
        credentials: {
          scope: ['organisations_details-child:write'],
          role: RoleEnum.TWINE_ADMIN,
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test.skip('updating child community business address updates coordinates', async () => {});
    test.skip('updating child community business post code updates coordinates', async () => {});
  });
});
