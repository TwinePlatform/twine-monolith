import * as Knex from 'knex';
import { pick } from 'ramda';
import { User, Organisation } from './types';
import { Dictionary } from '../types/internal';


type UserSessionRecord = {
  id: number
  sessionId: string
  userId: number
  organisationId: number
  headers: Dictionary<string>[]
  createdAt: Date
};

interface UserSessionRecordCollection {
  initSession (k: Knex, u: User, o: Organisation, sid: string, headers?: Dictionary<string>):
    Promise<UserSessionRecord>;

  updateSession (k: Knex, sid: string, headers?: Dictionary<string>): Promise<number>;

  endSession (k: Knex, sid: string, type: string): Promise<number>;
}

const filterHeaders = pick([
  'user-agent',
  'referer',
]);


export const UserSessionRecords: UserSessionRecordCollection = {
  async initSession (client, user, org, sessionId, headers) {
    const [result] = await client('user_session_record')
      .insert({
        user_account_id: user.id,
        organisation_id: org.id,
        request_headers: JSON.stringify(headers ? [filterHeaders(headers)] : []),
        session_id: sessionId,
      })
      .returning('*');

    return {
      id: result.user_session_record_id,
      sessionId,
      userId: user.id,
      organisationId: org.id,
      headers: result.request_headers,
      createdAt: result.created_at,
    };
  },

  async updateSession (client, sessionId, headers) {
    if (!headers || !sessionId) {
      return null;
    }

    const [existingHeaders]: { headers: Dictionary<string>[] }[] =
      await client('user_session_record')
        .select('request_headers AS headers')
        .where({ session_id: sessionId });

    if (!existingHeaders) {
      return null;
    }

    const newHeaders = existingHeaders.headers.concat(filterHeaders(headers));

    return client('user_session_record')
      .update({ request_headers: JSON.stringify(newHeaders) })
      .where({ session_id: sessionId });
  },

  async endSession (client, sessionId, type) {
    return await client('user_session_record')
      .update({ ended_at: new Date(), session_end_type: type })
      .where({ session_id: sessionId });
  },
};
