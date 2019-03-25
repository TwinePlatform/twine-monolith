/*
 * Create new Community business
 *
 * Usage:
 *  npm run exec ./bin/create_cb.ts -- [--name=a]
 *                                     [--_360GivingId=b]
 *                                     [--region=c]
 *                                     [--sector=d]
 *
 * Flags:
 *  name: Community business name
 *  _360GivingId: Community business 360 Giving ID
 *  region: Community business region (must be valid)
 *  sector: Community business sector (must be valid)
 *
 * Note: Including the argument separator `--` before any of the flags is important.
 *       Without it, the argument parsing will not work.
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { CommunityBusinesses } from '../src/models';
import { getConfig } from '../config';

process.on('unhandledRejection', (err) => { throw err; });

const { _360GivingId, name, region, sector } = parse(process.argv.slice(2));

if (!name || !_360GivingId || !region || !sector) {
  throw new Error('Missing arguments');
}

(async () => {
  const { knex: config, env } = getConfig(process.env.NODE_ENV);
  const client = Knex(config);

  try {
    await client.transaction(async (trx) => {
      const cb = await CommunityBusinesses.add(trx, { name, _360GivingId, region, sector });

      console.log(`
        Community Business added to ${env} database:
          ID: ${cb.id}
          Name: ${cb.name}
          360 Giving ID: ${cb._360GivingId}
          Region: ${cb.region}
          Sector: ${cb.sector}
      `);
    });

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }

  await client.destroy();
})();
