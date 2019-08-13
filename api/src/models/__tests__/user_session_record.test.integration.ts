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

    test(':: creates partial session record in DB -- no referrers', async () => {
      MockDate.set('2019-08-10T22:11:19');

      const sid = 'foo';
      const record = await UserSessionRecords.initSession(trx, user, org, sid);
      const check = await trx('user_session_record').select('*');

      expect(record).toEqual(expect.objectContaining({
        sessionId: sid,
        userId: user.id,
        organisationId: org.id,
        referrers: [],
        startedAt: new Date('2019-08-10T22:11:19'),
      }));

      expect(check).toHaveLength(1);
      expect(omit(['created_at', 'user_session_record_id'], check[0])).toEqual({
        session_id: sid,
        user_account_id: user.id,
        organisation_id: org.id,
        referrers: [],
        session_end_type: null,
        started_at: new Date('2019-08-10T22:11:19'),
        ended_at: null,
        modified_at: null,
        deleted_at: null,
      });
    });

    test(':: creates partial session record in DB -- with referrers', async () => {
      MockDate.set('2019-08-10T22:11:19');

      const sid = 'foo';
      const referrers = ['https://foo.com/bar'];
      const record = await UserSessionRecords.initSession(trx, user, org, sid, referrers);
      const check = await trx('user_session_record').select('*');

      expect(record).toEqual(expect.objectContaining({
        sessionId: sid,
        userId: user.id,
        organisationId: org.id,
        referrers,
        startedAt: new Date('2019-08-10T22:11:19'),
      }));

      expect(check).toHaveLength(1);
      expect(omit(['created_at', 'user_session_record_id'], check[0])).toEqual({
        user_account_id: user.id,
        organisation_id: org.id,
        session_id: sid,
        referrers,
        session_end_type: null,
        started_at: new Date('2019-08-10T22:11:19'),
        ended_at: null,
        modified_at: null,
        deleted_at: null,
      });
    });
  });

  describe('updateSession', () => {
    test('update with no new referrers', async () => {
      const sid = 'foo';
      const referrers = ['https://foo.com/bar'];
      const record = await UserSessionRecords.initSession(trx, user, org, sid, referrers);
      const result = await UserSessionRecords.updateSession(trx, record.sessionId);
      const query = await trx('user_session_record')
        .select('*')
        .where({ user_session_record_id: record.id });

      expect(result).toEqual(null);
      expect(query).toHaveLength(1);
      expect(query[0].referrers).toEqual(referrers);
      expect(query[0].modified_at).toBe(null);
    });

    test('update with new referrers', async () => {
      const sid = 'foo';
      const referrers1 = ['https://foo.com/bar'];
      const referrers2 = ['https://foo.com/lol'];
      const record = await UserSessionRecords.initSession(trx, user, org, sid, referrers1);
      const result = await UserSessionRecords.updateSession(trx, record.sessionId, referrers2);
      const query = await trx('user_session_record')
        .select('*')
        .where({ user_session_record_id: record.id });

      expect(result).toEqual(1);
      expect(query).toHaveLength(1);
      expect(query[0].referrers).toEqual(referrers1.concat(referrers2));
      expect(query[0].modified_at).not.toBe(null);
    });
  });

  describe('endSession', () => {
    test('marks session ended with current timestamp', async () => {
      MockDate.set('2019-10-10T13:45:22');

      const sid = 'foo';
      const referrers = ['https://foo.com/bar'];
      const record = await UserSessionRecords.initSession(trx, user, org, sid, referrers);

      MockDate.set('2019-10-10T14:15:43');

      const result = await UserSessionRecords.endSession(trx, record.sessionId, 'log_out');
      const query = await trx('user_session_record')
        .select('*')
        .where({ user_session_record_id: record.id });

      expect(result).toEqual(1);
      expect(query).toHaveLength(1);
      expect(query[0]).toEqual(expect.objectContaining({
        started_at: new Date('2019-10-10T13:45:22'),
        ended_at: new Date('2019-10-10T14:15:43'),
        session_end_type: 'log_out',
        referrers,
      }));
    });
  });
});
