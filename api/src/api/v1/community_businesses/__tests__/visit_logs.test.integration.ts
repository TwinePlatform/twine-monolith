import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { RoleEnum } from '../../../../auth/types';


describe('API v1 :: Community Businesses :: Visit Logs', () => {
  let server: Hapi.Server;
  let visitor: User;
  let cbAdmin: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);

    visitor = await Users.getOne(server.app.knex, { where: { id: 1 } });
    cbAdmin = await Users.getOne(server.app.knex, { where: { id: 2 } });
    organisation = await Organisations.getOne(server.app.knex, { where: { id: 1 } });
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('POST', () => {
    test(':: successfully add new visit log', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-logs',
        payload: {
          userId: 1,
          qrCode: 'chellsqrcode',
          visitActivityId: 2,
        },
        credentials: {
          user: cbAdmin,
          organisation,
          scope: ['visit_logs-own:write'],
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({ userId: 1, visitActivityId: 2 }),
      });
    });

    test(':: invalid QR code returns 400', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-logs',
        payload: {
          userId: 1,
          qrCode: 'thisisnotmyqrcode',
          activityId: 2,
        },
        credentials: {
          user: cbAdmin,
          organisation,
          scope: ['visit_logs-own:write'],
          role: RoleEnum.ORG_ADMIN,
        },
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
