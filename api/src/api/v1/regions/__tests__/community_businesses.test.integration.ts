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

  describe('GET /regions/community-businesses', () => {
    test('happy path', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/regions/community-businesses',
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual({
        London: [{ id: 1, name: 'Aperture Science' }, { id: 2, name: 'Black Mesa Research' }],
      });
    });
  });
});
