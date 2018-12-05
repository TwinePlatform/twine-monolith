import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../tests/utils/server';
import { getConfig } from '../../../../../config';
import pre from '../get_community_business';
import { CommunityBusinesses, Organisations, CbAdmins, Users } from '../../../../models';


describe('Prerequisites :: getCommunityBusiness', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeAll(async () => {
    server = await init(config, { knex });
    server.route([
      {
        method: 'GET',
        path: '/foo/{organisationId}',
        options: {
          pre: [{ method: pre, assign: 'community_business' }],
        },
        handler: async (request, h) => request.pre.community_business,
      },
      {
        method: 'GET',
        path: '/poo',
        options: {
          pre: [{ method: pre, assign: 'community_business' }],
        },
        handler: async (request, h) => request.pre.community_business,
      },
    ]);
  });

  afterAll(async () => await knex.destroy());

  test('unrecognised id returns a 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo/194852942',
    });

    expect(res.statusCode).toBe(404);
    expect(res.result).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'No associated community business',
    });
  });

  test('using "me" as request parameter', async () => {
    const organisation = await Organisations.getOne(knex, { where: { id: 1 } });
    const [user] = await CbAdmins.fromOrganisation(knex, organisation);
    const cb = await CommunityBusinesses.getOne(knex, { where: { id: organisation.id } });

    const res = await server.inject({
      method: 'GET',
      url: '/foo/me',
      credentials: { scope: [], user: { organisation, user, roles: [] } },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(cb);
  });

  test('using database ID as request parameter', async () => {
    const communityBusiness = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });

    const res = await server.inject({ method: 'GET', url: '/foo/1' });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(communityBusiness);
  });

  test('using 360 Giving ID as request parameter', async () => {
    const communityBusiness = await CommunityBusinesses.getOne(knex, {
      where: { _360GivingId: 'GB-COH-3205' },
    });

    const res = await server.inject({ method: 'GET', url: '/foo/GB-COH-3205' });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(communityBusiness);
  });

  test('no path parameter defaults to getting CB from credentials', async () => {
    const organisation =
      await Organisations.getOne(knex, { where: { _360GivingId: 'GB-COH-3205' } });
    const communityBusiness =
      await CommunityBusinesses.getOne(knex, { where: { id: organisation.id } });
    const user = await Users.getOne(knex, { where: { name: 'Chell' } });

    const res = await server.inject({
      method: 'GET',
      url: '/poo',
      credentials: {
        scope: [],
        user: {
          user,
          organisation,
          roles: [],
        },
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(communityBusiness);
  });
});
