const fs = require('fs');
const path = require('path');
const { compose, last, head } = require('ramda');

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
  ].join('\n'),
};

exports.migrate = {
  make: (name) => {
    const date = (new Date()).toISOString().slice(0, 10).replace(/-/g, '');
    const files = fs.readdirSync(path.resolve(__dirname, 'migrations', 'sql')).sort();
    const newVersion = Number(last(files).split('_')[1]) + 1;
    const newFilename = `${date}_${newVersion}_${name.toLowerCase().replace(/\s/g, '_')}`;

    write(path.resolve(MIGRATIONS_BASE_PATH, 'sql', `${newFilename}.sql`), templates.sql);
    write(path.resolve(MIGRATIONS_BASE_PATH, `${newFilename}.js`), templates.js);
  },
};
