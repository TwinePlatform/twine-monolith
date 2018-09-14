import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { RoleEnum } from '../../../../auth/types';
import { getTrx } from '../../../../../tests/utils/database';


describe('API /community-businesses/{id}/visitors', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let user: User;
  let visitor: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    visitor = await Users.getOne(knex, { where: { name: 'Chell' } });
    organisation = await Organisations.getOne(knex, { where: { id: 1 } });
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

  describe('GET /community-businesses/{id}/visitors', () => {
    test('non-filtered query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visitors',
        credentials: {
          organisation,
          user,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).result.visits).not.toBeDefined();
      expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
        name: 'Chell',
        deletedAt: null,
      }));
    });

    test('filtered query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visitors?fields[]=name&filter[gender]=male',
        credentials: {
          organisation,
          user,
          scope: ['user_details-child:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: [] });
    });

    test('filtered query with visits', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visitors?'
          + 'fields[]=name'
          + '&filter[age][]=17'
          + '&filter[age][]=60'
          + '&visits=true',
        credentials: {
          organisation,
          user,
          scope: ['user_details-child:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({
            name: 'Chell',
            visits: expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                visitActivity: 'Free Running',
              }),
            ]),
          }),
        ]),
      });
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).result[0].visits).toHaveLength(10);
    });

    test('query child organisation as TWINE_ADMIN', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/1/visitors',
        credentials: {
          role: RoleEnum.TWINE_ADMIN,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).result.visits).not.toBeDefined();
      expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
        name: 'Chell',
        deletedAt: null,
      }));
    });
  });


  describe('PUT /community-businesses/me/visitors/{id}', () => {
    test('can perform partial update of user model', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/community-businesses/me/visitors/${visitor.id}`,
        payload: {
          name: 'Tubby',
        },
        credentials: {
          user,
          organisation,
          scope: ['user_details-child:write'],
        },
      });

      const { modifiedAt, createdAt, deletedAt, password, qrCode, ...rest } = visitor;

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({ ...rest, name: 'tubby' }),
      });
      expect((<any> res.result).result.modifiedAt).toBeTruthy();
      expect((<any> res.result).result.modifiedAt).not.toBe(modifiedAt);
    });

    test('can perform full update of user model', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/community-businesses/me/visitors/${visitor.id}`,
        payload: {
          name: 'Tubby',
          gender: 'male',
          birthYear: 1972,
          email: 'tubbs@aperture.com',
          phoneNumber: '07892374881',
          postCode: 'N4 98H',
          isEmailConsentGranted: false,
          isSMSConsentGranted: true,
          disability: 'yes',
          ethnicity: 'prefer not to say',
        },
        credentials: {
          user,
          organisation,
          scope: ['user_details-child:write'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 1,
          name: 'tubby',
          gender: 'male',
          birthYear: 1972,
          email: 'tubbs@aperture.com',
          phoneNumber: '07892374881',
          postCode: 'N4 98H',
          isEmailConsentGranted: false,
          isSMSConsentGranted: true,
          disability: 'yes',
          ethnicity: 'prefer not to say',
        }),
      });
      expect((<any> res.result).result.modifiedAt).toBeTruthy();
      expect((<any> res.result).result.modifiedAt).not.toBe(user.modifiedAt);
    });

    test('bad update data returns 400', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/v1/community-businesses/me/visitors/${visitor.id}`,
        payload: {
          name: 'Wheatley',
          ethnicity: 'thisisprobablynotaethnicity',
        },
        credentials: {
          user,
          organisation,
          scope: ['user_details-child:write'],
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('idempotency', async () => {
      const res1 = await server.inject({
        method: 'PUT',
        url: `/v1/community-businesses/me/visitors/${visitor.id}`,
        payload: {
          name: 'Tubby',
        },
        credentials: {
          user,
          organisation,
          scope: ['user_details-child:write'],
        },
      });

      const res2 = await server.inject({
        method: 'PUT',
        url: `/v1/community-businesses/me/visitors/${visitor.id}`,
        payload: {
          name: 'tubby',
        },
        credentials: {
          user,
          organisation,
          scope: ['user_details-child:write'],
        },
      });

      expect(res1.statusCode).toBe(200);
      expect(res2.statusCode).toBe(200);
      expect(res1.result).toEqual(res2.result);
    });
  });
});
