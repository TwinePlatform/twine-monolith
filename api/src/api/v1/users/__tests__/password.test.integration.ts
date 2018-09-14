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

  describe('POST /users/password/forgot & POST /users/password/reset', () => {
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
    });

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
        templateId: '4148361',
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
          password: 'Password113!',
          confirmPassword: 'Password113!',
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
          password: 'otherPassword113!',
          confirmPassword: 'otherPassword113!',
        },
      });

      expect(res3.statusCode).toBe(400);

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

  test('::ERROR mismatching passwords', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/password/reset',
      payload: { token: 'faketoken', password: 'password114!', confirmPassword: 'password141!' },
    });

    expect(res.statusCode).toBe(400);
  });
});
