import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { getTrx } from '../../../../../../tests/utils/database';
import { Users, User, Organisations, Organisation } from '../../../../../models';
import { Credentials } from '../../../../../auth/strategies/standard';


describe('API v1 - register new users', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    server.app.EmailService = {
      send: () => Promise.resolve({
        To: '',
        SubmittedAt: '',
        MessageID: '',
        ErrorCode: 0,
        Message: '',
      }),
      sendBatch: () => Promise.resolve([{
        To: '',
        SubmittedAt: '',
        MessageID: '',
        ErrorCode: 0,
        Message: '',
      }]),
    };
    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    organisation = await Organisations.fromUser(knex, { where: user });
    credentials = await Credentials.get(knex, user, organisation, 'full');
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

  describe('POST /users/register/visitors', () => {
    test('user already exists', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'Chell',
          gender: 'female',
          birthYear: 1988,
          email: '1498@aperturescience.com',
        },
        credentials,
      });

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message).toBe('User with this e-mail already registered');
    });

    test('non-existent community business', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 9352,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
        },
        credentials,
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toBe('Cannot register visitor for different organisation');
    });

    test('cannot register against a different community business', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 2,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
        },
        credentials,
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message)
        .toBe('Cannot register visitor for different organisation');
    });

    test('happy path', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/users/register/visitors',
        payload: {
          organisationId: 1,
          name: 'foo',
          gender: 'female',
          birthYear: 1988,
          email: '13542@google.com',
        },
        credentials,
      });

      expect(res.statusCode).toBe(200);
      expect((<any> res.result).result).toEqual(expect.objectContaining({
        name: 'foo',
        gender: 'female',
        birthYear: 1988,
        email: '13542@google.com',
      }));
    });
  });
});
