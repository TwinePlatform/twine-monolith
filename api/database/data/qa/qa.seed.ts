import * as fs from 'fs';
import * as path from 'path';
import * as Knex from 'knex';


exports.seed = async (client: Knex) => {
  const files = fs.readdirSync(__dirname)
    .filter((f) => f.endsWith('.sql'))
    .map((f) => path.join(__dirname, f))
    .map((f) => fs.readFileSync(f, 'utf8'));

  for (let ii = 0; ii < files.length; ii = ii + 1) {
    const file = files[ii];
    await client.raw(file);
  }
};
