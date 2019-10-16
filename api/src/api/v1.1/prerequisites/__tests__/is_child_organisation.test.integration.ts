import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { initBlank as init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import { Users, CommunityBusinesses } from '../../../../models';
import pre from '../is_child_organisation';
import { RoleEnum, User, Organisation } from '../../../../models/types';
import { injectCfg } from '../../../../../tests/utils/inject';


describe('Pre-requisite :: is_child_organisation', () => {
  let server: Hapi.Server;
  let glados: User;
  let gordon: User;
  let aperture: Organisation;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeAll(async () => {
    server = await init(config, { knex });

    server.route({
      method: 'GET',
      path: '/foo',
      options: {
        pre: [{ method: pre, assign: 'is' }],
      },
      handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => request.pre,
    });

    glados = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    gordon = await Users.getOne(knex, { where: { name: 'Gordon' } });
    aperture = await CommunityBusinesses.getOne(knex, { where: { name: 'Aperture' } });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  test('returns false when user is CB_ADMIN for community business', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/foo',
      credentials: {
        user: {
          roles: [RoleEnum.CB_ADMIN],
          user: glados,
          organisation: aperture,
        },
        scope: [],
      },
    }));

    expect(res.result).toEqual({ is: false });
  });

  test('returns true when user is TWINE_ADMIN', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/foo',
      credentials: {
        user: {
          roles: [RoleEnum.TWINE_ADMIN],
          user: glados,
          organisation: aperture,
        },
        scope: [],
      },
    }));

    expect(res.result).toEqual({ is: true });
  });

  test('returns false when CB_ADMIN tries to access different organisation', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/foo',
      credentials: {
        user: {
          roles: [RoleEnum.CB_ADMIN],
          user: gordon,
          organisation: aperture,
        },
        scope: [],
      },
    }));

    expect(res.result).toEqual({ is: false });
  });
});
