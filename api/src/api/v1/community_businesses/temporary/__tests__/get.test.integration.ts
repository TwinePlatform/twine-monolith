import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisations } from '../../../../../models';
import { StandardCredentials } from '../../../../../auth/strategies/standard';
import { getTrx } from '../../../../../../tests/utils/database';


describe('GET /community-businesses/temporary', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let twAdmin: User;
  let twAdminCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    twAdmin = await Users.getOne(knex, { where: { name: 'Big Boss' } });
    const aperture = await Organisations.getOne(knex, { where: { name: 'Aperture Science' } });
    twAdminCreds = await StandardCredentials.get(knex, twAdmin, aperture);
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
    await server.shutdown(true);
  });

  test('success:: user TWINE_ADMIN return list of all temporary cbs', async () => {

      // no test data for temp cbs
    const res = await server.inject({
      method: 'GET',
      url: '/v1/community-businesses/temporary',
      credentials: twAdminCreds,
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toHaveLength(0);

      // create temp cb
    await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/register/temporary',
      credentials: twAdminCreds,
      payload: { orgName: 'Shinra Electric Power Company' },
    });

      // check route returns new list of temp accounts
    const res2 = await server.inject({
      method: 'GET',
      url: '/v1/community-businesses/temporary',
      credentials: twAdminCreds,
    });

    expect(res2.statusCode).toBe(200);
    expect((<any> res2.result).result).toHaveLength(1);
  });
});
