import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import factory from '../../../../../../tests/utils/factory';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { getTrx } from '../../../../../../tests/utils/database';
import { Users, Volunteers, CommunityBusinesses, Visitors } from '../../../../../models';
import { RoleEnum } from '../../../../../models/types';
import { Tokens } from '../../../../../models/token';


describe('API v1 - confirm adding a new role', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;

  const config = getConfig(process.env.NODE_ENV);
  const mockNewVisitor = jest.fn();

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    server.app.EmailService.newVisitor = mockNewVisitor;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
    mockNewVisitor.mockClear();
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  describe('POST /users/register/confirm', () => {
    test('FAIL :: cannot create role if email is associated to said role', async () => {
      const { token } = await Tokens.createConfirmAddRoleToken(
        trx, await Users.getOne(trx, { where: { id: 1 } }));

      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/confirm',
        payload: {
          organisationId: 1,
          userId: 1,
          role: RoleEnum.VISITOR,
          token,
        },
      });

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message)
        .toBe('visitor with this e-mail already registered');
    });

    test('FAIL :: cannot register role if user is registered under a different cb', async () => {
      const { token } = await Tokens.createConfirmAddRoleToken(
        trx, await Users.getOne(trx, { where: { id: 6 } }));

      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/confirm',
        payload: {
          organisationId: 1,
          userId: 6,
          role: RoleEnum.VISITOR,
          token,
        },
      });

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message)
        .toBe('User with this e-mail already registered at another Community Business');
    });

    test('SUCCESS :: add volunteer role to visitor', async () => {

      const changeset = await factory.build('visitor');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Aperture Science' } });
      const visitor = await Visitors.addWithRole(trx, cb, changeset);
      const { token } = await Tokens.createConfirmAddRoleToken(
        trx, await Users.getOne(trx, { where: { id: visitor.id } }));

      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/confirm',
        payload: {
          organisationId: cb.id,
          userId: visitor.id,
          role: RoleEnum.VOLUNTEER,
          token,
        },
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result.token).toBeTruthy();
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        email: visitor.email,
        id: visitor.id,
      }));
    });

    test('SUCCESS :: welcome email sent to add visitor if user already exists at cb', async () => {
      mockNewVisitor.mockReturnValueOnce(Promise.resolve());

      const changeset = await factory.build('volunteer');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Aperture Science' } });
      const volunteer = await Volunteers.addWithRole(trx, changeset, RoleEnum.VOLUNTEER, cb);

      const { token } = await Tokens.createConfirmAddRoleToken(
        trx, await Users.getOne(trx, { where: { id: volunteer.id } }));

      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/confirm',
        payload: {
          organisationId: cb.id,
          userId: volunteer.id,
          role: RoleEnum.VISITOR,
          token,
        },
      });
      expect(res.statusCode).toBe(200);
      expect(mockNewVisitor).toHaveBeenCalledTimes(1);
      expect(mockNewVisitor).toHaveBeenLastCalledWith(
        expect.objectContaining({}), // config
        expect.objectContaining({ email: volunteer.email }), // user
        expect.objectContaining({}), // cb admin
        expect.objectContaining({ name: cb.name }), // cb
        expect.stringMatching(/.*/) // attachment
      );
    });
  });
});
