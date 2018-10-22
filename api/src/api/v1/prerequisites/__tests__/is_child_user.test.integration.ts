import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../tests/utils/server';
import { RoleEnum } from '../../../../auth/types';
import { getConfig } from '../../../../../config';
import { Users, Organisations } from '../../../../models';
import pre from '../is_child_user';


describe('Pre-requisite :: is_child_user', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeAll(async () => {
    server = await init(config, { knex });

    server.route({
      method: 'GET',
      path: '/foo/{userId}',
      options: {
        pre: [{ method: pre, assign: 'is' }],
      },
      handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => request.pre,
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  test('returns true when TWINE_ADMIN', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo/1',
      credentials: {
        user: await Users.getOne(knex, { where: { name: 'Big Boss' } }),
        role: RoleEnum.TWINE_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ is: true });
  });

  test('returns true when CB_ADMIN accesses own VISITOR', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo/1',
      credentials: {
        user: await Users.getOne(knex, { where: { name: 'GlaDos' } }),
        organisation: await Organisations.getOne(knex, { where: { name: 'Aperture Science' } }),
        role: RoleEnum.CB_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ is: true });
  });

  test('returns true when CB_ADMIN accesses own VOLUNTEER', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo/6',
      credentials: {
        user: await Users.getOne(knex, { where: { name: 'Gordon' } }),
        organisation: await Organisations.getOne(knex, { where: { name: 'Black Mesa Research' } }),
        role: RoleEnum.CB_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ is: true });
  });

  test('returns false otherwise', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo/1',
      credentials: {
        user: await Users.getOne(knex, { where: { name: 'Gordon' } }),
        organisation: await Organisations.getOne(knex, { where: { name: 'Black Mesa Research' } }),
        role: RoleEnum.CB_ADMIN,
        scope: [],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ is: false });
  });
});
