import * as Knex from 'knex';
import { User, Organisation } from './types';


export const UserSessionRecords = {
  async initSession (client: Knex, user: User, org: Organisation, referrers: string[]) {
    const [result] = await client('user_session_record')
      .insert({
        user_account_id: user.id,
        organisation_id: org.id,
        referrers: JSON.stringify(referrers),
        started_at: new Date(),
      })
      .returning('*');

    return {
      id: result.user_session_record_id,
      startedAt: result.started_at,
    };
  },

  async updateSession (client: Knex, id: number, referrers: string[]) {
    const existingReferrers = await client('user_session_record')
      .select('referrers')
      .where({ user_session_record_id: id });

    return client('user_session_record')
      .update({ referrers: existingReferrers.concat(referrers) })
      .where({ user_session_record_id: id });
  },

  async endSession (client: Knex, id: number, type: string) {
    return client('user_session_record')
      .update({
        ended_at: new Date(),
        session_end_type: type,
      })
      .where({ user_session_record_id: id });
  },
};
