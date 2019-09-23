import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { init } from '../../../../../../tests/utils/server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../../models';
import { Credentials as StandardCredentials } from '../../../../../auth/strategies/standard';
import { injectCfg } from '../../../../../../tests/utils/inject';


describe('GET /community-businesses/{id}/cb-admins', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let admin: User;
  let user: User;
  let organisation: Organisation;
  let adminCreds: Hapi.AuthCredentials;
  let userCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    admin = await Users.getOne(knex, { where: { name: 'Big Boss' } });
    user = await Users.getOne(knex, { where: { name: 'Chell' } });
    organisation = await Organisations.getOne(knex, { where: { id: 1 } });
    adminCreds = await StandardCredentials.create(knex, admin, organisation);
    userCreds = await StandardCredentials.create(knex, user, organisation);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('query child organisation as TWINE_ADMIN', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/v1/community-businesses/1/cb-admins',
      credentials: adminCreds,
    }));
    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(1);
    expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
      name: 'GlaDos',
      deletedAt: null,
    }));
    expect((<any> res.result).meta).toEqual({ total: 1 });
  });

  test('403 if not TWINE_ADMIN', async () => {
    const res = await server.inject(injectCfg({
      method: 'GET',
      url: '/v1/community-businesses/1/cb-admins',
      credentials: userCreds,
    }));
    expect(res.statusCode).toBe(403);
    expect((<any> res.result).error).toEqual(expect.objectContaining({
      message: 'Insufficient scope',
      type: 'Forbidden',
    }));
  });
});
