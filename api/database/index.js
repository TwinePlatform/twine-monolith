const fs = require('fs');
const path = require('path');
const { compose, apply, last } = require('ramda');

const MIGRATIONS_BASE_PATH = path.resolve(__dirname, 'migrations');
// const SEEDS_BASE_PATH = path.resolve(__dirname, 'seeds');

// buildQuery :: String -> KnexClient -> Promise ()
exports.buildQuery =
  (path) =>
    (knex) =>
      compose(knex.raw, fs.readFileSync, apply(path.resolve))(path);

// buildPath :: String -> String
exports.buildPath = (fname) => [MIGRATIONS_BASE_PATH, 'sql', fname.replace('.js', '.sql')];

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
  ].join('\n'),
};

exports.migrate = {
  make: (name) => {
    const date = (new Date()).toISOString().slice(0, 10).replace(/-/g, '');
    const files = fs.readdirSync(path.resolve(__dirname, 'migrations', 'sql')).sort();
    const newVersion = Number(last(files).split('_')[1]) + 1;
    const newFilename = `${date}_${newVersion}_${name.toLowerCase().replace(/\s/g, '_')}`;

    write(path.resolve(__dirname, 'migrations', 'sql', `${newFilename}.sql`), templates.sql);
    write(path.resolve(__dirname, 'migrations', `${newFilename}.js`), templates.js);
  },
};
