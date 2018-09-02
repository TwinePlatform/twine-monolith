import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { RoleEnum } from '../../../../auth/types';


describe('API v1 :: Community Businesses :: Visit Activities', () => {
  let server: Hapi.Server;
  let user: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);

    user = await Users.getOne(server.app.knex, { where: { id: 1 } });
    organisation = await Organisations.getOne(server.app.knex, { where: { id: 1 } });
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET', () => {
    test(':: successfully gets all activities for own cb', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-activities',
        credentials: {
          user,
          organisation,
          scope: ['visit_activities-own:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: expect.arrayContaining(
        [
          expect.objectContaining({
            category: 'Socialising',
            id: 2,
            name: 'Wear Pink',
            monday: false,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          }),
          expect.objectContaining({
            id: 3,
            name: 'Free Running',
            category: 'Sports',
            monday: false,
            tuesday: true,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: true,
            sunday: true,
          }),
        ]),
      });
    });

    test(':: get activities for child cb', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/1/visit-activities',
        credentials: {
          role: RoleEnum.TWINE_ADMIN,
          scope: ['visit_activities-child:read'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: expect.arrayContaining(
        [
          expect.objectContaining({
            category: 'Socialising',
            id: 2,
            name: 'Wear Pink',
            monday: false,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          }),
          expect.objectContaining({
            id: 3,
            name: 'Free Running',
            category: 'Sports',
            monday: false,
            tuesday: true,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: true,
            sunday: true,
          }),
        ]),
      });
    });

    test(':: try to get activities for non-child cb', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/1/visit-activities',
        credentials: {
          user,
          organisation: await Organisations.getOne(server.app.knex, { where: { id: 2 } }),
          scope: ['visit_activities-child:read'],
        },
      });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT', () => {
    test(':: successfully updates a visit activity', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/visit-activities/2',
        payload: { monday: true, category: 'Sports' },
        credentials: {
          user,
          organisation,
          scope: ['visit_activities-own:write'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 2,
          category: 'Sports',
          name: 'Wear Pink',
          monday: true,
          tuesday: false,
          wednesday: true,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        }),
      });
    });

    test(':: cannot update activity owned by different CB', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/visit-activities/2',
        payload: { monday: true },
        credentials: {
          user,
          organisation: await Organisations.getOne(server.app.knex, { where: { id: 2 } }),
          scope: ['visit_activities-own:write'],
        },
      });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST', () => {
    test(':: successfully add a new activity', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/visit-activities',
        payload: {
          name: 'Base Jumping',
          category: 'Adult skills building',
        },
        credentials: {
          user,
          organisation,
          scope: ['visit_activities-own:write'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual(
        { result: expect.objectContaining(
          {
            id: 5,
            name: 'Base Jumping',
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          }),
        });
    });
  });

  describe('DELETE', () => {
    test(':: successfully deletes an activity', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/visit-activities/1',
        credentials: {
          user,
          organisation,
          scope: ['visit_activities-own:delete'],
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result.deletedAt).toBeTruthy();

      const check = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-activities',
        credentials: { user, organisation, scope: ['visit_activities-own:read'] },
      });

      expect(
        (<any> check.result).result
          .map((a: any) => a.name)
          .includes('Absailing')
      ).toBeFalsy();
    });
  });
});
