import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../tests/utils/server';
import { RoleEnum } from '../../../../auth/types';
import { getConfig } from '../../../../../config';
import { Users, Organisation, User, CommunityBusinesses, Volunteers } from '../../../../models';
import pre from '../require_sibling_user';


describe('Pre-requisite :: is_sibling_user', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);
  let apertureScience: Organisation;
  let blackMesa: Organisation;
  let orgAdmin: User;
  let volunteerAdmin: User;
  let adminFromWrongOrg: User;

  beforeAll(async () => {
    server = await init(config, { knex });
    apertureScience = await CommunityBusinesses.getOne(server.app.knex, { where: { id: 1 } });
    blackMesa = await CommunityBusinesses.getOne(server.app.knex, { where: { id: 2 } });
    orgAdmin = await Volunteers.getOne(server.app.knex, { where: { id: 5 } });
    volunteerAdmin = await Volunteers.getOne(server.app.knex, { where: { id: 7 } });
    adminFromWrongOrg = await Volunteers.getOne(server.app.knex, { where: { id: 8 } });

    server.route({
      method: 'GET',
      path: '/aliens/{userId}',
      options: {
        pre: [{ method: pre, assign: 'isSiblingUser' }],
      },
      handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => request.pre,
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  test('returns true when TWINE_ADMIN accesses any user', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/aliens/6',
      credentials: {
        user: await Users.getOne(knex, { where: { name: 'Big Boss' } }),
        role: RoleEnum.TWINE_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ isSiblingUser: true });
  });

  test('returns true when CB_ADMIN accesses user at the same org', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/aliens/6',
      credentials: {
        user: orgAdmin,
        organisation: blackMesa,
        role: RoleEnum.CB_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ isSiblingUser: true });
  });

  test('returns true when VOLUNTEER_ADMIN accesses user at the same org', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/aliens/6',
      credentials: {
        user: volunteerAdmin,
        organisation: blackMesa,
        role: RoleEnum.CB_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ isSiblingUser: true });
  });

  test('returns error when CB_ADMIN at another org accesses user', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/aliens/6',
      credentials: {
        user: adminFromWrongOrg,
        organisation: apertureScience,
        role: RoleEnum.CB_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
