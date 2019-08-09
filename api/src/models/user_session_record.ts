import * as Knex from 'knex';
import { uniq } from 'ramda';
import { User, Organisation } from './types';


export const UserSessionRecords = {
  async initSession (client: Knex, user: User, org: Organisation, sessionId: string, referrers: string[] = []) {
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
    };
  },

  async updateSession (client: Knex, sessionId: string, referrers: string[] = []) {
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

  async endSession (client: Knex, sessionId: string, type: string) {
    return await client('user_session_record')
      .update({ ended_at: new Date(), session_end_type: type })
      .where({ user_session_record_id: sessionId });
  },
};
