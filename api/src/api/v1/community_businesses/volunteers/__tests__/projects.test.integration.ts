import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { CommunityBusinesses, Organisation, User, Volunteers } from '../../../../../models';


describe('API /community-businesses/me/volunteers/projects', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let organisation: Organisation;
  let vol: User;
  let volAdmin: User;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    organisation = await CommunityBusinesses.getOne(knex, { where: { id: 2 } });
    vol = await Volunteers.getOne(knex, { where: { name: 'Emma Emmerich' } });
    volAdmin = await Volunteers.getOne(knex, { where: { name: 'Raiden' } });
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
          scope: ['organisation_details-parent:read'],
          organisation,
          user: vol,
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
          scope: ['organisation_details-parent:read'],
          organisation,
          user: vol,
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
          scope: ['organisation_details-parent:write'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:read'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:write'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:read'],
          organisation,
          user: vol,
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
          scope: ['organisation_details-parent:read'],
          organisation,
          user: vol,
        },
      });

      expect(res.statusCode).toBe(404);
    });

    test('cannot get project belonging to other CB', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers/projects/2',
        credentials: {
          scope: ['organisation_details-parent:read'],
          organisation,
          user: vol,
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
          scope: ['organisation_details-parent:write'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:write'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:write'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:delete'],
          organisation,
          user: volAdmin,
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
          scope: ['organisation_details-parent:delete'],
          organisation,
          user: volAdmin,
        },
      });

      expect(res.statusCode).toBe(404);
    });

    test('cannot delete other organisations project', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: '/v1/community-businesses/2/volunteers/projects/2',
        credentials: {
          scope: ['organisation_details-parent:delete'],
          organisation,
          user: volAdmin,
        },
      });

      expect(res.statusCode).toBe(404);
    });
  });
});
