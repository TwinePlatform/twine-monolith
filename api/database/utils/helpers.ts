import * as fs from 'fs';
import * as path from 'path';
import * as Knex from 'knex';
import { compose, head } from 'ramda';

const MIGRATIONS_BASE_PATH = path.resolve(__dirname, '..', 'migrations');

const readFile = (fpath: string) => fs.readFileSync(fpath, 'utf8');

export const buildQuery = (path: string) =>
  (knex: Knex) => compose((s) => knex.raw(s), readFile)(path);

export const buildPath = (fname: string) =>
  head(fname
    .split('/')
    .slice(-1)
    .map((s) => s.replace('.ts', '.sql'))
    .map((s) => path.resolve(MIGRATIONS_BASE_PATH, 'sql', s)));

export const buildQueryFromFile = compose(buildQuery, buildPath);

export const write = (fpath: string, data: string) => fs.writeFileSync(fpath, data, { flag: 'wx' });
