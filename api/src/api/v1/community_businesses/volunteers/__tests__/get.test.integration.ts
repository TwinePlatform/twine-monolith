import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, CommunityBusinesses, Organisation, Volunteers } from '../../../../../models';
import { RoleEnum } from '../../../../../auth/types';


describe('API /community-businesses/{id}/volunteers', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let organisation: Organisation;
  let volunteerAdmin: User;
  let orgAdmin: User;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    organisation = await CommunityBusinesses.getOne(knex, { where: { id: 2 } });
    volunteerAdmin = await Volunteers.getOne(knex, { where: { id: 7 } });
    orgAdmin = await Volunteers.getOne(knex, { where: { id: 5 } });
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /community-businesses/{id}/volunteers', () => {
    test(':: success - Volunteer Admin can access volunteer details for their org', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers',
        credentials: {
          organisation,
          volunteerAdmin,
          scope: ['user_details-sibling:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(2);
      expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
        name: 'Emma Emmerich',
        deletedAt: null,
      }));
      expect((<any> res.result).meta).toEqual({ total: 2 });
    });

    test(':: success with offset', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers?offset=1',
        credentials: {
          organisation,
          user: volunteerAdmin,
          scope: ['user_details-sibling:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).meta).toEqual({ total: 2 });
    });

    test(':: success - Org Admin can access volunteer details for their org', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers',
        credentials: {
          organisation,
          user: orgAdmin,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(2);
      expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
        name: 'Emma Emmerich',
        deletedAt: null,
      }));
      expect((<any> res.result).meta).toEqual({ total: 2 });
    });

    test(':: fail - Volunteer Admin cannot access volunteer details for another org', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/1/volunteers',
        credentials: {
          organisation,
          user: volunteerAdmin,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(403);
    });

    test(':: fail - Org Admin cannot access volunteer details for another org', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/1/volunteers',
        credentials: {
          organisation,
          user: orgAdmin,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(403);
    });

    test(':: success - TWINE_ADMIN can access child organisation', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/2/volunteers',
        credentials: {
          role: RoleEnum.TWINE_ADMIN,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(2);
      expect((<any> res.result).result[0]).toEqual(expect.objectContaining({
        name: 'Emma Emmerich',
        deletedAt: null,
      }));
      expect((<any> res.result).meta).toEqual({ total: 2 });
    });
  });
});
