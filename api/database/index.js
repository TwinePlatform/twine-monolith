const fs = require('fs');
const path = require('path');
const knex = require('knex');
const { compose, last, head, tap } = require('ramda');
const { getConfig, TESTING } = require('../config');
const { lazyPromiseSeries } = require('../src/utils');
const MIGRATIONS_BASE_PATH = path.resolve(__dirname, 'migrations');

// readFile :: String -> String
const readFile = (fpath) => fs.readFileSync(fpath, 'utf8');

// buildQuery :: String -> KnexClient -> Promise ()
exports.buildQuery = (path) => (knex) => compose(knex.raw, readFile)(path);

// buildPath :: String -> String
exports.buildPath = (fname) =>
  head(fname
    .split('/')
    .slice(-1)
    .map((s) => s.replace('.js', '.sql'))
    .map((s) => path.resolve(MIGRATIONS_BASE_PATH, 'sql', s)));

// buildQueryFromFile :: String -> KnexClient -> Promise ()
exports.buildQueryFromFile = compose(exports.buildQuery, exports.buildPath);

// write :: (String, String) -> ()
const write = (fpath, data) => fs.writeFileSync(fpath, data, { flag: 'wx' });

const templates = {
  sql: [
    '/*',
    ' * Migration template',
    ' */',
  ].join('\n'),

  js: [
    'const { buildQueryFromFile } = require(\'..\');',
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

    return 1;
  },

  teardown: async ({env = process.env.NODE_ENV, client} = {}) => {
    const config = getConfig(env);
    const teardownClient = client ? client : knex(config.knex);

    const tables = await teardownClient('pg_catalog.pg_tables').select('tablename').where({ schemaname: 'public' });

    const queries = tables
      .map((t) => t.tablename)
      .filter((t) => t !== 'spatial_ref_sys')
      .map(tap((t) => {
        if(config.env !== TESTING) console.log(`Dropping table ${t}`)
      }))
      .map((tablename) => teardownClient.raw(`DROP TABLE IF EXISTS "${tablename}" CASCADE`))
      .concat([
        'ENUM_turnover_band',
        'ENUM_permission_level',
        'ENUM_access_type',
        'ENUM_invitation_status',
        'ENUM_subscription_status',
      ]
        .map(tap((t) => {
          if(config.env !== TESTING) console.log(`Dropping type ${t}`)
        }))
        .map((e) => teardownClient.raw(`DROP TYPE IF EXISTS ${e} CASCADE`))
      );

    await teardownClient.transaction((trx) =>
      lazyPromiseSeries(queries.map((q) => q.transacting(trx)))
        .then(trx.commit)
        .catch(trx.rollback)
    )

    return client ? null : teardownClient.destroy();
  },

  truncate: async ({env = process.env.NODE_ENV, client} = {}) => {
    const config = getConfig(env);
    const truncateClient = client ? client : knex(config.knex);

    const tables = await truncateClient('pg_catalog.pg_tables')
    .select('tablename')
    .where({ schemaname: 'public' })
    .whereNot({ tablename:'spatial_ref_sys' });

    const queries = tables.map((x) => truncateClient.raw(`TRUNCATE ${x.tablename} RESTART IDENTITY CASCADE`));

    await Promise.all(queries);
    return client ? null : truncateClient.destroy();
  }
};
