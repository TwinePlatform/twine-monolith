import * as Hapi from 'hapi';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';


describe('API /users/visitors', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /users', () => {
    test('non-filtered query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/visitors',
        credentials: { scope: ['users_details-child:read'] },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).result.visits).not.toBeDefined();
      expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
        name: 'Chell',
        deletedAt: null,
      }));
    });

    test('filtered query', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/visitors?fields[]=name&filter[gender]=male',
        credentials: { scope: ['users_details-child:read'] },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: [] });
    });

    test('filtered query with visits', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/users/visitors?fields[]=name&filter[age][]=17&filter[age][]=60&visits=true',
        credentials: { scope: ['users_details-child:read'] },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.arrayContaining([
          expect.objectContaining({
            name: 'Chell',
            visits: expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                visitActivity: 'Free Running',
              }),
            ]),
          }),
        ]),
      });
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).result[0].visits).toHaveLength(10);
    });
  });
});
