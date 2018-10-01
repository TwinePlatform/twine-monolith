import * as Hapi from 'hapi';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { Organisation, User, Volunteers, CommunityBusinesses } from '../../../../../models';


describe('GET /v1/users/volunteers/:id', () => {
  let server: Hapi.Server;
  let apertureScience: Organisation;
  let blackMesa: Organisation;
  let volunteerAdmin: User;
  let adminFromWrongOrg: User;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    apertureScience = await CommunityBusinesses.getOne(server.app.knex, { where: { id: 1 } });
    blackMesa = await CommunityBusinesses.getOne(server.app.knex, { where: { id: 2 } });
    volunteerAdmin = await Volunteers.getOne(server.app.knex, { where: { id: 7 } });
    adminFromWrongOrg = await Volunteers.getOne(server.app.knex, { where: { id: 8 } });
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
        organisation: blackMesa,
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.objectContaining({
      name: 'Emma Emmerich',
    }));
  });

  test(':: fail - volunteer admin from a different org cannot access user details', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/v1/users/volunteers/6',
      credentials: {
        scope: ['user_details-sibling:read'],
        user: adminFromWrongOrg,
        organisation: apertureScience,
      },
    });

    expect(res.statusCode).toBe(401);
  });
});
