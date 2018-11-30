import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { Organisation, User, Volunteers, CommunityBusinesses, Users } from '../../../../../models';
import { getTrx } from '../../../../../../tests/utils/database';
import { Credentials } from '../../../../../auth/strategies/standard';


describe('DELETE /v1/users/volunteers/:id', () => {
  let server: Hapi.Server;
  let trx: Knex.Transaction;
  let knex: Knex;

  let organisation: Organisation;
  let otherOrganisation: Organisation;
  let user: User;
  let otherUser: User;
  let twAdmin: User;
  let credentials: Hapi.AuthCredentials;
  let otherCredentials: Hapi.AuthCredentials;
  let twAdminCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    organisation = await CommunityBusinesses.getOne(knex, { where: { id: 2 } });
    otherOrganisation = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });

    user = await Volunteers.getOne(knex, { where: { id: 7 } });
    otherUser = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    twAdmin = await Users.getOne(knex, { where: { name: 'Big Boss' } });

    credentials = await Credentials.get(knex, user, organisation);
    otherCredentials = await Credentials.get(knex, otherUser, otherOrganisation);
    twAdminCreds = await Credentials.get(knex, twAdmin, otherOrganisation);
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
    const getRes = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials,
    });

    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/6',
      credentials,
    });

    const getRes2 = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials,
    });

    // volunteer exists
    expect(getRes.statusCode).toBe(200);
    // delete route is successful
    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(null);
    // cannot retreive volunteer after they have been deleted
    expect(getRes2.statusCode).toBe(404);
  });

  test(':: fail - user that is not a volunteer returns 404', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/3',
      credentials,
    });

    expect(res.statusCode).toBe(404);
  });

  test(':: success - twine admin can delete any volunteer', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/7',
      credentials: twAdminCreds,
    });
    expect(res.statusCode).toBe(200);
  });

  test(':: fail - org admin from another cb cannot delete volunteer', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: '/v1/users/volunteers/7',
      credentials: otherCredentials,
    });
    expect(res.statusCode).toBe(403);
  });
});

