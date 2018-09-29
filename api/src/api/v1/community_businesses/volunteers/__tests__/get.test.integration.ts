import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../../models';
import { RoleEnum } from '../../../../../auth/types';


describe('API /community-businesses/{id}/volunteers', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let user: User;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'Gordon' } });
    organisation = await Organisations.getOne(knex, { where: { id: 2 } });
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('GET /community-businesses/{id}/volunteers', () => {
    test('happy path', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers',
        credentials: {
          organisation,
          user,
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

    test('happy path with offset', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/volunteers?offset=1',
        credentials: {
          organisation,
          user,
          scope: ['user_details-child:read'],
        },
      });
      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toHaveLength(1);
      expect((<any> res.result).meta).toEqual({ total: 2 });
    });

    test('query child organisation as TWINE_ADMIN', async () => {
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
