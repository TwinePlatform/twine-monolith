import * as Knex from 'knex';
import * as MockDate from 'mockdate';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/utils/database';
import { UserSessionRecords } from '../user_session_record';
import { User, Organisation } from '../types';
import { Users } from '../user';
import { Organisations } from '../organisation';


describe('UserSessionRecords model', () => {
  let trx: Knex.Transaction;
  let user: User;
  let org: Organisation;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  beforeAll(async () => {
    user = await Users.getOne(knex, { where: { id: 1 } });
    org = await Organisations.fromUser(knex, { where: user });
  });

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  describe('initSession', () => {
    afterAll(() => MockDate.reset());

    test(':: creates partial session record in DB -- no headers', async () => {
      const sid = 'foo';
      const record = await UserSessionRecords.initSession(trx, user, org, sid);
      const check = await trx('user_session_record').select('*');

      expect(record).toEqual(expect.objectContaining({
        sessionId: sid,
        userId: user.id,
        organisationId: org.id,
        headers: [],
        createdAt: expect.any(Date),
      }));

      expect(check).toHaveLength(1);
      expect(omit(['user_session_record_id'], check[0])).toEqual({
        session_id: sid,
        user_account_id: user.id,
        organisation_id: org.id,
        request_headers: [],
        session_end_type: null,
        created_at: expect.any(Date),
        ended_at: null,
        modified_at: null,
        deleted_at: null,
      });
    });

    test(':: creates partial session record in DB -- with headers', async () => {
      const sid = 'foo';
      const headers = { referer: 'https://foo.com/bar' };
      const record = await UserSessionRecords.initSession(trx, user, org, sid, headers);
      const check = await trx('user_session_record').select('*');

      expect(record).toEqual(expect.objectContaining({
        sessionId: sid,
        userId: user.id,
        organisationId: org.id,
        headers: [headers],
        createdAt: expect.any(Date),
      }));

      expect(check).toHaveLength(1);
      expect(omit(['user_session_record_id'], check[0])).toEqual({
        user_account_id: user.id,
        organisation_id: org.id,
        session_id: sid,
        request_headers: [headers],
        session_end_type: null,
        created_at: expect.any(Date),
        ended_at: null,
        modified_at: null,
        deleted_at: null,
      });
    });
  });

  describe('updateSession', () => {
    test('update with no new headers', async () => {
      const sid = 'foo';
      const headers = { referer: 'https://foo.com/bar' };
      const record = await UserSessionRecords.initSession(trx, user, org, sid, headers);
      const result = await UserSessionRecords.updateSession(trx, record.sessionId);
      const query = await trx('user_session_record')
        .select('*')
        .where({ user_session_record_id: record.id });

      expect(result).toEqual(null);
      expect(query).toHaveLength(1);
      expect(query[0].request_headers).toEqual([headers]);
      expect(query[0].modified_at).toBe(null);
    });

    test('update with new headers', async () => {
      const sid = 'foo';
      const headers1 = { referer: 'https://foo.com/bar' };
      const headers2 = { referer: 'https://foo.com/lol' };
      const record = await UserSessionRecords.initSession(trx, user, org, sid, headers1);
      const result = await UserSessionRecords.updateSession(trx, record.sessionId, headers2);
      const query = await trx('user_session_record')
        .select('*')
        .where({ user_session_record_id: record.id });

      expect(result).toEqual(1);
      expect(query).toHaveLength(1);
      expect(query[0].request_headers).toEqual([headers1, headers2]);
      expect(query[0].modified_at).not.toBe(null);
    });
  });

  describe('endSession', () => {
    test('marks session ended with current timestamp', async () => {
      MockDate.set('2019-10-10T13:45:22');

      const sid = 'foo';
      const headers = { referer: 'https://foo.com/bar' };
      const record = await UserSessionRecords.initSession(trx, user, org, sid, headers);

      MockDate.set('2019-10-10T14:15:43');

      const result = await UserSessionRecords.endSession(trx, record.sessionId, 'log_out');
      const query = await trx('user_session_record')
        .select('*')
        .where({ user_session_record_id: record.id });

      expect(result).toEqual(1);
      expect(query).toHaveLength(1);
      expect(query[0]).toEqual(expect.objectContaining({
        created_at: expect.any(Date),
        ended_at: new Date('2019-10-10T14:15:43'),
        session_end_type: 'log_out',
        request_headers: [headers],
      }));
    });
  });
});
