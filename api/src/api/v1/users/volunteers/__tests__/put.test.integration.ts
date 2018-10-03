import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { Organisation, User, Volunteers, CommunityBusinesses } from '../../../../../models';
import { getTrx } from '../../../../../../tests/utils/database';
import { RoleEnum } from '../../../../../auth/types';


describe('PUT /v1/users/volunteers/:id', () => {
  let server: Hapi.Server;
  let trx: Knex.Transaction;
  let knex: Knex;

  let organisation: Organisation;
  let user: User;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    organisation = await CommunityBusinesses.getOne(server.app.knex, { where: { id: 2 } });
    user = await Volunteers.getOne(server.app.knex, { where: { id: 7 } });
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  afterAll(async () => {
    server.shutdown(true);
  });

  test(':: success - volunteers details updated', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/v1/users/volunteers/6',
      payload: {
        name: 'Snake',
        email: 'box@shadowmoses.ak',
        phoneNumber: '10101010101010',
        gender: 'prefer not to say',
        birthYear: 1972,
      },
      credentials: {
        scope: ['user_details-sibling:write'],
        user,
        organisation,
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.objectContaining({
      name: 'snake',
      id: 6,
    }));
  });

  test(':: idempotency', async () => {
    const res1 = await server.inject({
      method: 'PUT',
      url: '/v1/users/volunteers/6',
      payload: {
        name: 'Snake',
      },
      credentials: {
        user,
        organisation,
        scope: ['user_details-child:write'],
      },
    });

    const res2 = await server.inject({
      method: 'PUT',
      url: '/v1/users/volunteers/6',
      payload: {
        name: 'Snake',
      },
      credentials: {
        user,
        organisation,
        scope: ['user_details-sibling:write'],
      },
    });

    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res1.result).toEqual(res2.result);
  });

  test(':: fail - unsupported payload returns 400', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/v1/users/volunteers/6',
      payload: {
        favouritePet: 'Snake',
      },
      credentials: {
        scope: ['user_details-sibling:write'],
        user,
        organisation,
      },
    });

    expect(res.statusCode).toBe(400);
  });

  test(':: fail - non volunteer cannot be updated', async () => {
    const res = await server.inject({
      method: 'PUT',
      url: '/v1/users/volunteers/2',
      payload: {
        name: 'Snake',
      },
      credentials: {
        scope: ['user_details-sibling:write'],
        role: RoleEnum.TWINE_ADMIN,
      },
    });

    expect(res.statusCode).toBe(404);
  });
});

