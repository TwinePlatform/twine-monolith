import * as fs from 'fs';
import * as path from 'path';
import * as Knex from 'knex';
import { Config } from '../../config';


export default async (config: Config, client: Knex, dataSet: string) => {
  const dir = path.join(config.root, 'database', 'data');
  const files = fs.readdirSync(dir)
    .filter((f) => f === dataSet)
    .map((f) => path.join(dir, f))
    .map((d) =>
      fs.readdirSync(d)
        .filter((f) => f.endsWith('.seed.ts'))
        .map((f) => path.join(d, f))
        .sort()
    )
    .reduce((acc, x) => acc.concat(x), []);

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
