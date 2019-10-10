/*
 * User API functional tests
 */
import * as Hapi from '@hapi/hapi';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import { Credentials as StandardCredentials } from '../../../../auth/strategies/standard';
import { Organisation, User, Users, Organisations } from '../../../../models';
import { injectCfg } from '../../../../../tests/utils/inject';


describe('API /users', () => {
  let server: Hapi.Server;
  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);

    user = await Users.getOne(server.app.knex, { where: { name: 'Big Boss' } });
    organisation =
      await Organisations.getOne(server.app.knex, { where: { name: 'Aperture Science' } });
    credentials = await StandardCredentials.create(server.app.knex, user, organisation);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /users', () => {
    test('501', async () => {
      const res = await server.inject(injectCfg({
        method: 'GET',
        url: '/v1/users',
        credentials,
      }));

      expect(res.statusCode).toBe(501);
    });
  });
});
