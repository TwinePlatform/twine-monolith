import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { CommunityBusinesses } from '../../../../models';

describe('API v1 :: Community Businesses :: Visit Activities', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET', () => {
    test(':: successfully gets all activities for a cb', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visit-activities',
        credentials: { scope: ['visit_activities-own:read'] },
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
  });
  describe('PUT', () => {
    test(':: successfully updates a visit activity', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/visit-activities/1',
        payload: {
          id: 2,
          monday: true,
        },
        credentials: { scope: ['visit_activities-own:write'] },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual(
        { result: expect.objectContaining(
          {
            id: 2,
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
        credentials: { scope: ['visit_activities-own:write'] },
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
        credentials: { scope: ['visit_activities-own:delete'] },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result.deletedAt).toBeTruthy();
      const doubleCheck = await CommunityBusinesses.getVisitActivities(server.app.knex, { id: 1 });
      expect(doubleCheck).toEqual(
        (<any> expect).not.arrayContaining([
          expect.objectContaining({
            name: 'Absailing',
          }),
        ]));
    });
  });
});
