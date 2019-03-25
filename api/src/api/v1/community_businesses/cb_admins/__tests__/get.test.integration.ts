import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../../models';
import { StandardCredentials } from '../../../../../auth/strategies/standard';


describe('GET /community-businesses/{id}/cb-admins', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let admin: User;
  let organisation: Organisation;
  let adminCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    admin = await Users.getOne(knex, { where: { name: 'Big Boss' } });
    organisation = await Organisations.getOne(knex, { where: { id: 1 } });
    adminCreds = await StandardCredentials.get(knex, admin, organisation);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('query child organisation as TWINE_ADMIN', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/community-businesses/1/cb-admins',
      credentials: adminCreds,
    });
    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(1);
    expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
      name: 'GlaDos',
      deletedAt: null,
    }));
    expect((<any> res.result).meta).toEqual({ total: 1 });

  });
});
