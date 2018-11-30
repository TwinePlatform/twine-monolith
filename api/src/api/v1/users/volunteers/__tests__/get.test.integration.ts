import * as Hapi from 'hapi';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import {
  Organisation,
  User,
  Volunteers,
  CommunityBusinesses,
  CbAdmins,
} from '../../../../../models';
import { Credentials } from '../../../../../auth/strategies/standard';


describe('GET /v1/users/volunteers/:id', () => {
  let server: Hapi.Server;
  let organisation: Organisation;
  let wrongOrganisation: Organisation;
  let volunteerAdmin: User;
  let orgAdmin: User;
  let wrongOrgAdmin: User;
  let volunteerCreds: Hapi.AuthCredentials;
  let adminCreds: Hapi.AuthCredentials;
  let wrongAdminCreds: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);

    organisation = await CommunityBusinesses
      .getOne(server.app.knex, { where: { name: 'Black Mesa Research' } });
    wrongOrganisation = await CommunityBusinesses
      .getOne(server.app.knex, { where: { name: 'Aperture Science' } });

    volunteerAdmin = await Volunteers.getOne(server.app.knex, { where: { name: 'Raiden' } });
    orgAdmin = await CbAdmins.getOne(server.app.knex, { where: { name: 'Gordon' } });
    wrongOrgAdmin = await Volunteers.getOne(server.app.knex, { where: { name: 'Turret' } });

    volunteerCreds = await Credentials.get(server.app.knex, volunteerAdmin, organisation);
    adminCreds = await Credentials.get(server.app.knex, orgAdmin, organisation);
    wrongAdminCreds = await Credentials.get(server.app.knex, wrongOrgAdmin, wrongOrganisation);
  });

  afterAll(async () => {
    server.shutdown(true);
  });

  test(':: success - volunteer admin can access volunteer from same org', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: volunteerCreds,
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.objectContaining({
      name: 'Emma Emmerich',
    }));
  });

  test(':: success - org admin can access volunteer from same org', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: adminCreds,
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.objectContaining({
      name: 'Emma Emmerich',
    }));
  });

  test(':: fail - non volunteer user returns a 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/1',
      credentials: wrongAdminCreds,
    });

    expect(res.statusCode).toBe(404);
  });

  test(':: fail - volunteer admin from a different org cannot access user details', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: wrongAdminCreds,
    });

    expect(res.statusCode).toBe(403);
  });
});
