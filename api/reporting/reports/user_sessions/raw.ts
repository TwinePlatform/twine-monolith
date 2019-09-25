import * as Url from 'url';
import * as Knex from 'knex';
import { UAParser } from 'ua-parser-js';
import { omit, pathOr } from 'ramda';
import { getConfig } from '../../../config';
import { csv } from '../../writers';
import { Dictionary } from '../../../src/types/internal';

type Row = {
  userId: number;
  userName: string;
  organisationId: number;
  organisationName: string;
  sessionStartedAt: Date;
  sessionEndedAt: Date;
  headers: Dictionary<string>[];
  sessionEndType: string;
};

const parser = new UAParser();

const processHeaders = (headers: Dictionary<string>) => {
  const t = parser.setUA(headers['user-agent']).getResult();

  const urlObj = 'referer' in headers
    ? Url.parse(headers.referer)
    : null;

  return { agent: t, url: urlObj };
};

const main = async (client: Knex) => {
  const res: Row[] = await client('user_session_record')
    .innerJoin(
      'user_account',
      'user_account.user_account_id',
      'user_session_record.user_account_id'
    )
    .innerJoin(
      'user_account_access_role',
      'user_account_access_role.user_account_id',
      'user_account.user_account_id'
    )
    .innerJoin(
      'organisation',
      'organisation.organisation_id',
      'user_account_access_role.organisation_id'
    )
    .select({
      userId: 'user_account.user_account_id',
      userName: 'user_account.user_name',
      organisationId: 'organisation.organisation_id',
      organisationName: 'organisation_name',
      sessionStartedAt: 'user_session_record.created_at',
      sessionEndedAt: 'user_session_record.ended_at',
      headers: 'request_headers',
      sessionEndType: 'session_end_type'
    })
    .whereNotIn('organisation.organisation_id', [1, 2]);

  const rows = res.map((row, i) => {
    const headers = row.headers.map(processHeaders);
    const app = pathOr('volunteer-app', ['url', 'host'], headers[0]);
    const device = headers[0].agent.device;
    const pages = headers
      .map((header) => pathOr(null, ['url', 'path'], header))
      .filter(Boolean);

    return {
      ...omit(['headers'], row),
      app,
      pages,
      device,
    };
  });

  await csv([
    'userId',
    'userName',
    'organisationId',
    'organisationName',
    'sessionStartedAt',
    'sessionEndedAt',
    'sessionEndType',
    'device',
    'app',
    'pages'
  ], rows, 'user_sessions_raw.csv');
}

export default async (): Promise<void> => {
  const config = getConfig(process.env.NODE_ENV);
  const client = Knex(config.knex);

  try {
    await main(client);
  } finally {
    client.destroy();
  }
};
