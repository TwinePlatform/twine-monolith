const fs = require('fs');
const path = require('path');
const knex = require('knex');
const { compose, last, head, tap } = require('ramda');
const { getConfig } = require('../config');

// lazyPromiseSeries :: [PromiseLike (a)] -> Promise ([a])
const lazyPromiseSeries = (ps) => ps.reduce((acc, p) => p.then((res) => [].concat(acc ? acc : []).concat(res)))

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

  teardown: async (name, env = process.env.NODE_ENV) => {
    const config = getConfig(env);

    const client = knex(config.knex);

    const tables = await client('pg_catalog.pg_tables').select('tablename').where({ schemaname: 'public' });

    const queries = tables
      .map((t) => t.tablename)
      .filter((t) => t !== 'spatial_ref_sys')
      .map(tap((t) => console.log(`Dropping table ${t}`)))
      .map((tablename) => client.raw(`DROP TABLE IF EXISTS "${tablename}" CASCADE`))
      .concat([
        'ENUM_gender',
        'ENUM_turnover_band',
        'ENUM_permission_type',
        'ENUM_permission_access',
        'ENUM_invitation_status',
        'ENUM_organisation_type',
        'ENUM_subscription_status',
      ]
        .map(tap((t) => console.log(`Dropping type ${t}`)))
        .map((e) => client.raw(`DROP TYPE IF EXISTS ${e} CASCADE`))
      );

    await client.transaction((trx) =>
      lazyPromiseSeries(queries.map((q) => q.transacting(trx)))
        .then(trx.commit)
        .catch(trx.rollback)
    )

    return client.destroy();
  },
};
