/*
 * script for editing an existing user
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { Roles } from '../src/auth';
import { getConfig } from '../config';

process.on('unhandledRejection', (err) => { throw err; });

const { userId, oid, add, rm } = parse(process.argv.slice(2));

if (!userId || !oid || !(add && rm)) {
  throw new Error('Not enough arguments supplied');
}

(async () => {
  const { knex: config } = getConfig(process.env.NODE_ENV);
  const client = Knex(config);

  try {
    await client.transaction(async (trx) => {
      if (add) {
        await Roles.add(trx, { userId, organisationId: oid, role: add });
      }

      if (rm) {
        await Roles.remove(trx, { userId, organisationId: oid, role: rm });
      }
    });

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }

  await client.destroy();
})();
