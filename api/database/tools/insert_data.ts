import * as fs from 'fs';
import * as path from 'path';
import * as Knex from 'knex';
import { Config } from '../../config';


export default async (config: Config, client: Knex, dataSets: string) => {
  const dir = path.join(config.root, 'database', 'test_data');
  const files = fs.readdirSync(dir)
    .filter((f) => f.startsWith(dataSets))
    .map((f) => path.join(dir, f))
    .sort();

  await client.transaction(async (trx) => {
    // This needs to be a for loop because the data sets should be
    // inserted serially, not in parallel
    for (let i = 0; i < files.length; i = i + 1) {
      const mod = require(files[i]);
      await mod.seed(trx);
      console.log(`Inserted ${files[i]}`);
    }
  });
};
