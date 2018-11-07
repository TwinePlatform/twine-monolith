import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { CommunityBusinesses, Organisation } from '../../../../../models';


describe('API /community-businesses/{id}/volunteers', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    organisation = await CommunityBusinesses.getOne(knex, { where: { id: 2 } });
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /community-businesses/me/volunteers/projects', () => {
    test('can fetch own projects', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers/projects',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: [
          { name: 'Party', organisationId: organisation.id },
          { name: 'Take over the world', organisationId: organisation.id },
        ].map(expect.objectContaining),
      });
    });

    test('cannot fetch other orgs projects', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/2/volunteers/projects',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /community-businesses/me/volunteers/projects', () => {
    test('can create new project for own org', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/me/volunteers/projects',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          organisation,
        },
        payload: {
          name: 'new project',
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          organisationId: organisation.id,
          name: 'new project',
        }),
      });

      const res2 = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers/projects',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          organisation,
        },
      });

      expect(res2.statusCode).toBe(200);
      expect((<any> res2.result).result).toHaveLength(3);
    });

    test('cannot create new project for other org', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/2/volunteers/projects',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /community-businesses/me/volunteers/projects/{id}', () => {
    test('can get single project', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers/projects/1',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 1,
          organisationId: organisation.id,
          name: 'Party',
        }),
      });
    });

    test('cannot get non-existent project', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers/projects/99999',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });

    test('cannot get project belonging to other CB', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers/projects/2',
        credentials: {
          scope: ['volunteer_logs-own:read'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /community-businesses/me/volunteers/projects/{id}', () => {
    test('can update project name', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/volunteers/projects/1',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          organisation,
        },
        payload: {
          name: 'Foo',
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          id: 1,
          name: 'Foo',
          organisationId: organisation.id,
        }),
      });
    });

    test('cannot update organisationId', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/me/volunteers/projects/1',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          organisation,
        },
        payload: {
          organisationId: 3,
        },
      });

      expect(res.statusCode).toBe(400);
    });

    test('cannot update other organisations projects', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: '/v1/community-businesses/2/volunteers/projects/1',
        credentials: {
          scope: ['volunteer_logs-own:write'],
          organisation,
        },
        payload: {
          name: 'Foo',
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /community-businesses/me/volunteers/projects/{id}', async () => {
    test('can mark own project deleted', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/volunteers/projects/1',
        credentials: {
          scope: ['volunteer_logs-own:delete'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({ result: null });
    });

    test('cannot mark non-existent project as deleted', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/me/volunteers/projects/999',
        credentials: {
          scope: ['volunteer_logs-own:delete'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });

    test('cannot delete other organisations project', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/2/volunteers/projects/2',
        credentials: {
          scope: ['volunteer_logs-own:delete'],
          organisation,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
