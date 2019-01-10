/*
 * Edit roles for a user
 *
 * Usage:
 *  npm run exc ./bin/edit_user_role.ts [--userId=a] [--oid=b] [--add=role] [--rm=role]
 *
 * Flags:
 *  userId: Integer corresponding to `user_account_id` in database
 *  oid: Integer corresponding to `organisation_id` in database
 *  add: Role to add to given user at given organisation. Must be member of `RoleEnum` enumeration
 *  rm: Role to remove to given user at given organisation. Must be member of `RoleEnum` enumeration
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import Roles from '../src/auth/roles';
import { getConfig } from '../config';

process.on('unhandledRejection', (err) => { throw err; });

const { userId, oid, add, rm } = parse(process.argv.slice(2));

if (!userId || !oid || !(add || rm)) {
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
