/*
 * User API functional tests
 */
import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';

describe('API /users', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /users', () => {
    test('happy path', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users',
        credentials: { scope: ['users_details-child:read'] },
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
