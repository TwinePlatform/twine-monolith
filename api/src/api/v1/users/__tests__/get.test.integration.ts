/*
 * User API functional tests
 */
import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { Credentials } from '../../../../auth/strategies/standard';
import { Organisation, User, Users, Organisations } from '../../../../models';


describe('API /users', () => {
  let server: Hapi.Server;
  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);

    user = await Users.getOne(server.app.knex, { where: { name: 'GlaDos' } });
    organisation =
      await Organisations.getOne(server.app.knex, { where: { name: 'Aperture Science' } });
    credentials = await Credentials.get(server.app.knex, user, organisation);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /users', () => {
    test('happy path', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users',
        credentials,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Chell',
            email: '1498@aperturescience.com',
            postCode: '49829',
            birthYear: 1988,
            gender: 'female',
            disability: 'no',
            ethnicity: 'prefer not to say',
            isEmailConfirmed: false,
            isEmailConsentGranted: false,
            isPhoneNumberConfirmed: false,
            isSMSConsentGranted: false,
            deletedAt: null,
            modifiedAt: null,
          }),

          expect.objectContaining({
            id: 4,
            name: 'Barney',
            email: '2305@blackmesaresearch.com',
            postCode: '82394',
            birthYear: 1974,
            gender: 'male',
            disability: 'no',
            ethnicity: 'prefer not to say',
            isEmailConfirmed: false,
            isEmailConsentGranted: false,
            isPhoneNumberConfirmed: false,
            isSMSConsentGranted: false,
            deletedAt: null,
            modifiedAt: null,
          }),
        ]),
      });
    });
  });
});
