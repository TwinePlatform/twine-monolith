import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../tests/utils/server';
import factory from '../../../../../tests/utils/factory';
import { getConfig } from '../../../../../config';
import pre from '../getOrganisation';
import { Organisations } from '../../../../models';


describe('Prerequisites :: getOrganisation', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeAll(async () => {
    server = await init(config, { knex });
    server.route({
      method: 'GET',
      path: '/foo/{organisationId}',
      options: {
        pre: [{ method: pre, assign: 'organisation' }],
      },
      handler: async (request, h) => request.pre.organisation,
    });
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
      message: 'No associated organisation',
    });
  });

  test('using "me" as request parameter', async () => {
    const organisation = await factory.build('organisation');
    const user = await factory.build('user');

    const res = await server.inject({
      method: 'GET',
      url: '/foo/me',
      credentials: { scope: [], organisation, user },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(organisation);
  });

  test('using database ID as request parameter', async () => {
    const organisation = await Organisations.getOne(knex, { where: { id: 1 } });

    const res = await server.inject({ method: 'GET', url: '/foo/1' });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(organisation);
  });

  test('using 360 Giving ID as request parameter', async () => {
    const organisation = await Organisations.getOne(knex, {
      where: { _360GivingId: 'GB-COH-3205' },
    });

    const res = await server.inject({ method: 'GET', url: '/foo/GB-COH-3205' });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(organisation);
  });
});
