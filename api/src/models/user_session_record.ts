import * as Knex from 'knex';
import { uniq } from 'ramda';
import { User, Organisation } from './types';


type UserSessionRecord = {
  id: number
  sessionId: string
  userId: number
  organisationId: number
  referrers: string[]
  startedAt: Date
  createdAt: Date
};

interface UserSessionRecordCollection {
  initSession (k: Knex, u: User, o: Organisation, sid: string, refs?: string[]):
    Promise<UserSessionRecord>;

  updateSession (k: Knex, sid: string, refs?: string[]): Promise<number>;

  endSession (k: Knex, sid: string, type: string): Promise<number>;
}


export const UserSessionRecords: UserSessionRecordCollection = {
  async initSession (client, user, org, sessionId, referrers = []) {
    const [result] = await client('user_session_record')
      .insert({
        user_account_id: user.id,
        organisation_id: org.id,
        referrers: JSON.stringify(referrers),
        started_at: new Date(),
        session_id: sessionId,
      })
      .returning('*');

    return {
      id: result.user_session_record_id,
      sessionId,
      userId: user.id,
      organisationId: org.id,
      referrers,
      startedAt: result.started_at,
      createdAt: result.created_at,
    };
  },

  async updateSession (client, sessionId, referrers = []) {
    if (referrers.length < 1) {
      return null;
    }

    const [existingReferrers]: { referrers: string[] }[] = await client('user_session_record')
      .select('referrers')
      .where({ session_id: sessionId });

    const newReferrers = JSON.stringify(uniq(existingReferrers.referrers.concat(referrers)));

    return await client('user_session_record')
      .update({ referrers: newReferrers })
      .where({ session_id: sessionId });
  },

  async endSession (client, sessionId, type) {
    return await client('user_session_record')
      .update({ ended_at: new Date(), session_end_type: type })
      .where({ session_id: sessionId });
  },
};
