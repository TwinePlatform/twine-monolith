import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { compare } from 'bcrypt';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisations } from '../../../../../models';
import { StandardCredentials } from '../../../../../auth/strategies/standard';
import { getTrx } from '../../../../../../tests/utils/database';


describe('GET /community-businesses/temporary/:id/password/reset', () => {
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

  test('success:: user TWINE_ADMIN successfully resets a password for a temp user', async () => {
    // create temp cb
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/register/temporary',
      credentials: twAdminCreds,
      payload: { orgName: 'Shinra Electric Power Company' },
    });

    const { communityBusiness: tempCb, cbAdmin: tempCbAdmin } = (<any> res.result).result;

    // reset password
    const res2 = await server.inject({
      method: 'GET',
      url: `/v1/community-businesses/temporary/${tempCb.id}/password/reset`,
      credentials: twAdminCreds,
    });

    const newPassword = (<any> res2.result).result.password;
    const { password: hashedPw } = await Users.getOne(trx, { where: { id: tempCbAdmin.id } });
    expect(await compare(newPassword, hashedPw)).toBeTruthy();
  });

  test('fail:: does not work for non temp account', async () => {

    const res2 = await server.inject({
      method: 'GET',
      url: `/v1/community-businesses/temporary/1/password/reset`,
      credentials: twAdminCreds,
    });

    expect(res2.statusCode).toBe(403);
    expect((<any> res2.result).error.message).toEqual('Not a temporary organisation');
  });
});

