import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../tests/utils/server';
import { RoleEnum } from '../../../../auth/types';
import Roles from '../../../../auth/roles';
import { getConfig } from '../../../../../config';
import { Users, CommunityBusinesses } from '../../../../models';
import pre from '../is_parent_organisation';


describe('Pre-requisite :: is_parent_organisation', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeAll(async () => {
    server = await init(config, { knex });

    server.route({
      method: 'GET',
      path: '/foo/{organisationId}',
      options: {
        pre: [{ method: pre, assign: 'is' }],
      },
      handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => request.pre,
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  test('pre-req returns false when user is admin for community business', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo/1',
      credentials: {
        role: RoleEnum.ORG_ADMIN,
        user: await Users.getOne(knex, { where: { name: 'GlaDos' } }),
        organisation: await CommunityBusinesses.getOne(knex, { where: { name: 'Aperture' } }),
        scope: [],
      },
    });

    expect(res.result).toEqual({ is: false });
  });

  test('pre-req returns true when user is visitor for community business', async () => {
    const user = await Users.getOne(knex, { where: { name: 'Barney' } });
    const organisation = await CommunityBusinesses.getOne(knex, {
      where: { name: 'Black Mesa Research' },
    });
    await Roles.add(knex, {
      userId: user.id,
      organisationId: organisation.id,
      role: RoleEnum.VOLUNTEER,
    });

    const res = await server.inject({
      method: 'GET',
      url: '/foo/2',
      credentials: {
        role: RoleEnum.VOLUNTEER,
        user,
        organisation,
        scope: [],
      },
    });

    expect(res.result).toEqual({ is: true });

    await Roles.remove(knex, {
      userId: user.id,
      organisationId: organisation.id,
      role: RoleEnum.VOLUNTEER,
    });
  });
});
