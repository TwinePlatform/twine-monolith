/*
 * User API functional tests
 */
import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { compare } from 'bcrypt';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { getTrx } from '../../../../../tests/utils/database';
import { Users } from '../../../../models';

describe('POST /users/password', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;

  const config = getConfig(process.env.NODE_ENV);

  const mockEmailService = jest.fn();
  mockEmailService.mockReturnValueOnce({
    To: '1@aperturescience.com',
    SubmittedAt: 'today',
    MessageID: '10100101',
  });

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    server.app.EmailService.send = mockEmailService;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
    mockEmailService.mockReset();
  });

  describe('POST /users/password/forgot & POST /users/password/reset', () => {

    test('::SUCCESS email sent with reset token', async () => {
      /*
       * Part 1: Generate reset token
       */
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/forgot',
        payload: { email: '1@aperturescience.com' },
      });

      expect(res.statusCode).toBe(200);
      expect(mockEmailService.mock.calls.length).toBe(1);
      expect(mockEmailService.mock.calls[0][0]).toEqual(expect.objectContaining({
        from: 'visitorapp@powertochange.org.uk',
        templateId: 8786293,
        templateModel: expect.objectContaining({
          email: '1@aperturescience.com',
        }),
        to: '1@aperturescience.com'}));
      expect(mockEmailService.mock.calls[0][0].templateModel.token).toBeTruthy();

      /*
       * Part 2: Reset password with token
       */
      const token = mockEmailService.mock.calls[0][0].templateModel.token;
      expect(token).toHaveLength(64);
      const res2 = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: {
          token,
          email: '1@aperturescience.com',
          password: 'Password113!',
          passwordConfirm: 'Password113!',
        },
      });

      expect(res2.statusCode).toBe(200);

      const user1 = await Users.getOne(trx, { where: { email: '1@aperturescience.com' } });
      const matches1 = await compare('Password113!', user1.password);
      expect(matches1).toBe(true);

      /*
       * Part 3: Cannot re-use old token
       */
      const res3 = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: {
          token,
          email: '1@aperturescience.com',
          password: 'otherPassword113!',
          passwordConfirm: 'otherPassword113!',
        },
      });

      expect(res3.statusCode).toBe(401);

      const user2 = await Users.getOne(trx, { where: { email: '1@aperturescience.com' } });
      const matches2 = await compare('Password113!', user2.password);
      expect(matches2).toBe(true);
    });

    test('::ERROR non existent email', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/forgot',
        payload: { email: '1999@aperturescience.com' },
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /users/password/reset', () => {
    const fakeToken = 'mylengthis64characteslongimbluedabadedabadaaaardabadedabadaaaaar';

    test('::ERROR mismatching passwords', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: {
          token: fakeToken,
          email: 'lost@burmuda.is',
          password: 'Password114!',
          passwordConfirm: 'Password141!' },
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.validation).toEqual({
        passwordConfirm: 'must match password',
      });
    });

    test('::ERROR password too weak', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: {
          token: fakeToken,
          email: 'lost@burmuda.is',
          password: 'password111',
          passwordConfirm: 'password111' },
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.validation).toEqual({
        password: 'is too weak: must contain number, symbol, upper case and lower case',
      });
    });

    test('::ERROR token length not 64', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: { token: 'fakeToken', password: 'Password111!', passwordConfirm: 'Password111!' },
      });

      expect(res.statusCode).toBe(401);
      expect((<any> res.result).error.message).toEqual('Invalid token. Reset password again.');
    });

    test('::SUCCESS updates one row', async () => {
      const userOne = await Users.getOne(trx, { where: { id: 1 } });
      const userTwo = await Users.getOne(trx, { where: { id: 2 } });

      await server.inject({
        method: 'POST',
        url: '/v1/users/password/forgot',
        payload: { email: userOne.email },
      });

      const { templateModel: { token } } = mockEmailService.mock.calls[0][0];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: {
          token,
          email: userOne.email,
          password: 'Password114!',
          passwordConfirm: 'Password114!' },
      });

      const userTwoPointOne = await Users.getOne(trx, { where: { id: 2 } });

      expect((<any> res.result).result).toBe(null);
      expect(userTwo).toEqual(userTwoPointOne);
    });

    test('::ERROR unknown user', async () => {
      const userOne = await Users.getOne(trx, { where: { id: 1 } });

      await server.inject({
        method: 'POST',
        url: '/v1/users/password/forgot',
        payload: { email: userOne.email },
      });

      const { templateModel: { token } } = mockEmailService.mock.calls[0][0];

      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/password/reset',
        payload: {
          token,
          email: 'userOne@email.com',
          password: 'Password114!',
          passwordConfirm: 'Password114!' },
      });

      expect(res.statusCode).toBe(403);
    });
  });
});
