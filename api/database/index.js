const fs = require('fs');
const path = require('path');
const knex = require('knex');
const { last, tap } = require('ramda');
const { getConfig, Environment: { TESTING } } = require('../build/config');
const { write } = require('./utils')
const { lazyPromiseSeries } = require('../build/src/utils');


const templates = {
  sql: [
    '/*',
    ' * Migration template',
    ' */',
  ].join('\n'),

  js: [
    'const { buildQueryFromFile } = require(\'../util\');',
    'exports.up = buildQueryFromFile(__filename);',
    'exports.down = () => {};',
    '',
  ].join('\n'),
};

exports.migrate = {
  make: async (name) => {
    const date = (new Date()).toISOString().slice(0, 10).replace(/-/g, '');
    const files = fs.readdirSync(path.resolve(__dirname, 'migrations', 'sql')).sort();
    const newVersion = Number(last(files).split('_')[1]) + 1;
    const newFilename = `${date}_${newVersion}_${name.toLowerCase().replace(/\s/g, '_')}`;

    write(path.resolve(MIGRATIONS_BASE_PATH, 'sql', `${newFilename}.sql`), templates.sql);
    write(path.resolve(MIGRATIONS_BASE_PATH, `${newFilename}.js`), templates.js);

    return 0;
  },

  teardown: async ({ env = process.env.NODE_ENV, client: _client } = {}) => {
    const config = getConfig(env);
    const client = _client ? _client : knex(config.knex);

    const tables = await client('pg_catalog.pg_tables')
      .select('tablename')
      .where({ schemaname: 'public' })
      .whereNot({ tablename:'spatial_ref_sys' });

    const queries = tables
      .map((t) => t.tablename)
      .map(tap((t) => {
        if (config.env !== TESTING) console.log(`Dropping table ${t}`)
      }))
      .map((tablename) => client.raw(`DROP TABLE IF EXISTS "${tablename}" CASCADE`))
      .concat([
        'ENUM_turnover_band',
        'ENUM_permission_level',
        'ENUM_access_type',
        'ENUM_invitation_status',
        'ENUM_subscription_status',
      ]
        .map(tap((t) => {
          if (config.env !== TESTING) console.log(`Dropping type ${t}`)
        }))
        .map((e) => client.raw(`DROP TYPE IF EXISTS ${e} CASCADE`))
      );

    await client.transaction((trx) =>
      lazyPromiseSeries(queries.map((q) => q.transacting(trx)))
        .then(trx.commit)
        .catch(trx.rollback)
    )

    return _client ? null : client.destroy();
  },

  truncate: async ({ env = process.env.NODE_ENV, client: _client } = {}) => {
    const config = getConfig(env);
    const client = _client ? _client : knex(config.knex);

    const tables = await client('pg_catalog.pg_tables')
      .select('tablename')
      .where({ schemaname: 'public' })
      .whereNot({ tablename:'spatial_ref_sys' });

    await Promise.all(
      tables
        .map((x) =>
          client.raw(`TRUNCATE ${x.tablename} RESTART IDENTITY CASCADE`)));

    return _client ? null : client.destroy();
  }
};
