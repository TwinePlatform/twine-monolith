import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { Organisation, User, Volunteers, CommunityBusinesses, Users } from '../../../../../models';
import { getTrx } from '../../../../../../tests/utils/database';
import { RoleEnum } from '../../../../../auth/types';


describe('DELETE /v1/users/volunteers/:id', () => {
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

  test(':: success - volunteer deleted', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/6',
      credentials: {
        scope: ['user_details-sibling:write'],
        user,
        organisation,
      },
    });

    const res2 = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: {
        scope: ['user_details-sibling:read'],
        user,
        organisation,
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(null);
    expect((<any> res2.result).result.deletedAt).toBeTruthy();
  });

  test(':: fail - user that is not a volunteers returns 404', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/1',
      credentials: {
        scope: ['user_details-child:write'],
        role: RoleEnum.TWINE_ADMIN,
      },
    });

    expect(res.statusCode).toBe(404);
  });

  test(':: success - twine admin can delete any volunteer', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/7',
      payload: {
        favouritePet: 'Snake',
      },
      credentials: {
        scope: ['user_details-sibling:write'],
        role: RoleEnum.TWINE_ADMIN,
      },
    });
    expect(res.statusCode).toBe(200);
  });

  test(':: fail - org admin from another cb cannot delete volunteer', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/7',
      payload: {
        favouritePet: 'Snake',
      },
      credentials: {
        scope: ['user_details-sibling:write'],
        user: await Users.getOne(knex, { where: { name: 'GlaDos' } }),
        organisation: await CommunityBusinesses
          .getOne(knex, { where: { name: 'Aperture Science' } }),
      },
    });
    expect(res.statusCode).toBe(401);
  });
});

