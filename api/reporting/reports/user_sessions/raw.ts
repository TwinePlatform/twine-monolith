import * as Url from 'url';
import * as Knex from 'knex';
import { UAParser } from 'ua-parser-js';
import { evolve, isNil, omit, pathOr, uniq } from 'ramda';
import { getConfig, Config } from '../../../config';
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

const mapHostToApp = (host: string) => {
  switch (host) {
  case 'visitor.twine-together.com':
    return 'visitor-app';
  case 'data.twine-together.com':
    return 'dashboard-app';
  case undefined:
    return 'volunteer-app';
  default:
    return host;
  }
}

const main = async (config: Config, client: Knex) => {
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
    .whereNotIn('organisation.organisation_id', [1, 2])
    .orderBy('user_session_record.created_at', 'asc');

  const rows = res.map((row) => {
    const headers = row.headers.map(processHeaders);
    const app = mapHostToApp(pathOr(undefined, ['url', 'host'], headers[0]));
    const deviceType = headers[0].agent.device.type;
    const OS = headers[0].agent.os.name;
    const browser = headers[0].agent.browser.name + '::' + headers[0].agent.browser.version;
    const pages = uniq(headers
      .map((header) => pathOr(null, ['url', 'path'], header))
      .filter(Boolean));

    const processedRow = evolve({
      sessionStartedAt: (d: Date) => d.toISOString(),
      sessionEndedAt: (d?: Date) => (isNil(d) ? new Date(row.sessionStartedAt.valueOf() + config.auth.schema.session_cookie.options.cache.expiresIn) : d).toISOString(),
      sessionEndType: (s?: string) => isNil(s) ? 'expired' : s,
    }, row);

    return {
      ...omit(['headers'], processedRow),
      app,
      pages,
      deviceType,
      OS,
      browser,
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
    'deviceType',
    'OS',
    'browser',
    'app',
    'pages'
  ], rows, 'user_sessions_raw.csv');
}

export default async (): Promise<void> => {
  const config = getConfig(process.env.NODE_ENV);
  const client = Knex(config.knex);

  try {
    await main(config, client);
  } finally {
    client.destroy();
  }
};
