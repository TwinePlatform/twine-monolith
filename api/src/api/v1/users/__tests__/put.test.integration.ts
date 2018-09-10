import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getTrx } from '../../../../../tests/utils/database';
import { User, Users } from '../../../../models';


describe('PUT /users/me', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let user: User;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
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

  test('can perform partial update of user model', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/v1/users/me',
      payload: {
        name: 'Wheatley',
      },
      credentials: {
        user,
        scope: ['user_details-own:write'],
      },
    });

    const { modifiedAt, createdAt, deletedAt, password, qrCode, ...rest } = user;

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({
      result: expect.objectContaining({ ...rest, name: 'Wheatley' }),
    });
    expect((<any> res.result).result.modifiedAt).not.toBe(modifiedAt);
  });

  test('can perform full update of user model', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/v1/users/me',
      payload: {
        name: 'Wheatley',
        gender: 'male',
        birthYear: 1983,
        email: 'wheatus@aperture.com',
        phoneNumber: '02076542783',
        postCode: 'SW1 4FG',
        isEmailConsentGranted: true,
        isSMSConsentGranted: true,
        disability: 'yes',
        ethnicity: 'prefer not to say',
      },
      credentials: {
        user,
        scope: ['user_details-own:write'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({
      result: expect.objectContaining({
        id: 2,
        name: 'Wheatley',
        gender: 'male',
        birthYear: 1983,
        email: 'wheatus@aperture.com',
        phoneNumber: '02076542783',
        postCode: 'SW1 4FG',
        isEmailConsentGranted: true,
        isSMSConsentGranted: true,
        disability: 'yes',
        ethnicity: 'prefer not to say',
      }),
    });
    expect((<any> res.result).result.modifiedAt).not.toBe(user.modifiedAt);
  });

  test('bad update data returns 400', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/v1/users/me',
      payload: {
        name: 'Wheatley',
        ethnicity: 'thisisprobablynotaethnicity',
      },
      credentials: {
        user,
        scope: ['user_details-own:write'],
      },
    });

    expect(res.statusCode).toBe(400);
  });

  test.skip('idempotency', async () => {});
});
