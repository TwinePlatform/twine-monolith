import * as Hapi from 'hapi';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { Organisation, User, Volunteers, CommunityBusinesses } from '../../../../../models';


describe('GET /v1/users/volunteers/:id', () => {
  let server: Hapi.Server;
  let organisation: Organisation;
  let wrongOrganisation: Organisation;
  let volunteerAdmin: User;
  let orgAdmin: User;
  let adminFromWrongOrg: User;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    organisation = await CommunityBusinesses
      .getOne(server.app.knex, { where: { name: 'Black Mesa Research' } });
    wrongOrganisation = await CommunityBusinesses
      .getOne(server.app.knex, { where: { name: 'Aperture Science' } });
    volunteerAdmin = await Volunteers.getOne(server.app.knex, { where: { name: 'Raiden' } });
    orgAdmin = await Volunteers.getOne(server.app.knex, { where: { name: 'Gordon' } });
    adminFromWrongOrg = await Volunteers.getOne(server.app.knex, { where: { name: 'Turret' } });
  });

  afterAll(async () => {
    server.shutdown(true);
  });

  test(':: success - volunteer admin can access volunteer from same org', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: {
        scope: ['user_details-sibling:read'],
        user: volunteerAdmin,
        organisation,
      },
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
      credentials: {
        scope: ['user_details-sibling:read'],
        user: orgAdmin,
        organisation,
      },
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
      credentials: {
        scope: ['user_details-sibling:read'],
        user: adminFromWrongOrg,
        organisation: wrongOrganisation,
      },
    });

    expect(res.statusCode).toBe(404);
  });

  test(':: fail - volunteer admin from a different org cannot access user details', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: {
        scope: ['user_details-sibling:read'],
        user: adminFromWrongOrg,
        organisation: wrongOrganisation,
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
