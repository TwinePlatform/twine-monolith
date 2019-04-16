/* istanbul ignore file */
import * as path from 'path';
import * as Knex from 'knex';
import { tap } from 'ramda';
import { getConfig, Environment } from '../config';
import { lazyPromiseSeries } from '../src/utils';
import { write } from './utils';


type Args = Partial<{ env: string; client: Knex }>;


const templates = {
  sql: [
    '/*',
    ' * Migration template',
    ' */',
  ].join('\n'),

  ts: [
    'import { buildQueryFromFile } from \'../utils\';',
    'exports.up = buildQueryFromFile(__filename);',
    'exports.down = () => {};',
    '',
  ].join('\n'),
};

export const migrate = {
  make: async (name: string) => {
    const config = getConfig(process.env.NODE_ENV);
    const MIGRATIONS_BASE_PATH = config.knex.migrations.directory;

    const date = (new Date()).toISOString().slice(0, 10).replace(/-/g, '');
    const newFilename = `${date}_${name.toLowerCase().replace(/\s/g, '_')}`;
    write(path.resolve(MIGRATIONS_BASE_PATH, 'sql', `${newFilename}.sql`), templates.sql);
    write(path.resolve(MIGRATIONS_BASE_PATH, `${newFilename}.ts`), templates.ts);

    return 0;
  },

  teardown: async ({ env = process.env.NODE_ENV, client }: Args = {}) => {
    const config = getConfig(env);
    const _client = client ? client : Knex(config.knex);

    console.log(`Tearing down the "${config.env}" database\n`);

    const tables = await _client('pg_catalog.pg_tables')
      .select('tablename')
      .where({ schemaname: 'public' })
      .whereNot({ tablename: 'spatial_ref_sys' });

    const queries = tables
      .map((t: any) => t.tablename)
      .map(tap((t) => {
        if (config.env !== Environment.TESTING) console.log(`Dropping table ${t}`);
      }))
      .map((tablename: string) => _client.raw(`DROP TABLE IF EXISTS "${tablename}" CASCADE`))
      .concat([
        'ENUM_turnover_band',
        'ENUM_permission_level',
        'ENUM_access_type',
        'ENUM_invitation_status',
        'ENUM_subscription_status',
      ]
        .map(tap((t) => {
          if (config.env !== Environment.TESTING) console.log(`Dropping type ${t}`);
        }))
        .map((e) => _client.raw(`DROP TYPE IF EXISTS ${e} CASCADE`))
      );

    await _client.transaction((trx) =>
      lazyPromiseSeries(queries.map((q: Knex.QueryBuilder) => q.transacting(trx)))
        .then(trx.commit)
        .catch(trx.rollback)
    );

    return client ? null : _client.destroy();
  },

  truncate: async ({ env= process.env.NODE_ENV, client }: Args = {}) => {
    const config = getConfig(env);
    const _client = client ? client : Knex(config.knex);

    const tables = await _client('pg_catalog.pg_tables')
      .select('tablename')
      .where({ schemaname: 'public' })
      .whereNot({ tablename: 'spatial_ref_sys' });

    await Promise.all(
      tables
        .map((x: any) =>
          _client.raw(`TRUNCATE ${x.tablename} RESTART IDENTITY CASCADE`)));

    return client ? null : _client.destroy();
  },
};
