import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { init } from '../../../../../../tests/utils/server';
import { getConfig } from '../../../../../../config';
import { getTrx } from '../../../../../../tests/utils/database';
import { Users, User, Organisations, Organisation } from '../../../../../models';
import { Credentials as StandardCredentials } from '../../../../../auth/strategies/standard';
import { RoleEnum } from '../../../../../models/types';
import { injectCfg } from '../../../../../../tests/utils/inject';


describe('API v1 - register new users', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let user: User;
  let cbAdminBlackMesa: User;
  let organisation: Organisation;
  let blackMesa: Organisation;
  let credentials: Hapi.AuthCredentials;
  let credentialsBlackMesa: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);
  const mockNewVisitor = jest.fn();
  const mockAddRole = jest.fn();

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    server.app.EmailService.newVisitor = mockNewVisitor;
    server.app.EmailService.addRole = mockAddRole;

    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    cbAdminBlackMesa = await Users.getOne(knex, { where: { name: 'Gordon' } });
    organisation = await Organisations.fromUser(knex, { where: user });
    blackMesa = await Organisations.getOne(knex, { where: { name: 'Black Mesa Research' } });
    credentials = await StandardCredentials.create(knex, user, organisation);
    credentialsBlackMesa = await StandardCredentials.create(knex, cbAdminBlackMesa, blackMesa);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
    mockNewVisitor.mockClear();
    mockAddRole.mockClear();
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  describe('POST /users/register/visitors', () => {
    test('FAIL :: cannot create visitor if email is associated to another vistor', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Chell',
          gender: 'female',
          birthYear: 1988,
          email: '1498@aperturescience.com',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message)
        .toBe('Visitor with this e-mail already registered');
    });

    test('FAIL :: cannot create visitor if phone number is associated to another user',
    async () => {
      await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Ratman',
          gender: 'male',
          birthYear: null,
          phoneNumber: '090909090909',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      const res2 = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Ratman',
          gender: 'male',
          birthYear: null,
          phoneNumber: '090909090909',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res2.statusCode).toBe(409);
      expect((<any> res2.result).error.message)
        .toBe('User with this phone number already registered');
    });

    test('FAIL :: non-existent community business', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 9352,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toBe('Cannot register visitor for different organisation');
    });

    test('FAIL :: cannot register against a different community business', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 2,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toBe('Cannot register visitor for different organisation');
    });

    test('FAIL :: cannot register additonal role against VOLUNTEER_ADMIN', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 2,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: 'raiden@aotd.com', // email of VOLUNTEER_ADMIN
          postCode: 'ST10 4DB',
        },
        credentials: credentialsBlackMesa,
      }));

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message)
        .toBe('User with this e-mail already registered');
    });

    test('FAIL :: cannot register as a visitor if user is registered under a different cb',
    async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Emma Emmerich',
          gender: 'female',
          birthYear: 1900,
          email: 'emma@sol.com',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message)
        .toBe('User with this e-mail already registered at another Community Business');
    });

    test('SUCCESS :: conf email sent to add visitor if user already exists at cb', async () => {
      mockAddRole.mockReturnValueOnce(Promise.resolve());

      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 2,
          name: 'Emma Emmerich',
          gender: 'female',
          birthYear: 1900,
          email: 'emma@sol.com',
          postCode: 'ST10 4DB',
        },
        credentials: credentialsBlackMesa,
      }));

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message).toBe(
        'Email is associated to a volunteer, '
          + 'please see email confirmation to create visitor account'
      );

      expect(mockAddRole).toHaveBeenCalledTimes(1);
      expect(mockAddRole).toHaveBeenLastCalledWith(
        expect.objectContaining({}), // config
        expect.objectContaining({ email: 'emma@sol.com' }), // user
        expect.objectContaining({ name: 'Black Mesa Research' }), // cb
        RoleEnum.VISITOR,
        expect.stringMatching(/.*/) // token
      );
    });

    test('FAIL :: cannot register visitor without email & phone number', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Ratman',
          gender: 'male',
          birthYear: null,
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message).toBe('Please supply either email or phone number');
    });

    test('SUCCESS :: happy path for standard visitor', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        name: 'foo',
        gender: 'female',
        birthYear: 1988,
        email: '13542@google.com',
      }));
    });

    test('SUCCESS :: happy path for anonymous visitor', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          isAnonymous: true,
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        name: 'foo',
        gender: 'female',
        birthYear: 1988,
        email: 'anon_0_org_1',
      }));

      const res2 = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'boo',
          gender: 'female',
          birthYear: 1988,
          isAnonymous: true,
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res2.statusCode).toBe(200);
      expect((<any> res2.result).result).toEqual(expect.objectContaining({
        name: 'boo',
        gender: 'female',
        birthYear: 1988,
        email: 'anon_1_org_1',
      }));
    });

    test('SUCCESS :: register visitor with null birthYear', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Ratman',
          gender: 'male',
          birthYear: null,
          email: '666@aperturescience.com',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(200);
    });


    test('SUCCESS :: register visitor with only phone number', async () => {
      const res = await server.inject(injectCfg({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Ratman',
          gender: 'male',
          birthYear: null,
          phoneNumber: '090909090909',
          postCode: 'ST10 4DB',
        },
        credentials,
      }));

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        name: 'Ratman',
        gender: 'male',
        birthYear: null,
        phoneNumber: '090909090909',
      }));
    });
  });
});
