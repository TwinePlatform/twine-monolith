const fs = require('fs');
const path = require('path');
const { compose, head } = require('ramda');

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
exports.write = (fpath, data) => fs.writeFileSync(fpath, data, { flag: 'wx' });
