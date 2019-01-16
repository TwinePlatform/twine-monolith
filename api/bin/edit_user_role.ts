/*
 * Edit roles for a user
 *
 * Usage:
 *  npm run exec ./bin/edit_user_role.ts -- [--userId=a] [--orgId=b] [--add=role] [--rm=role]
 *
 * Flags:
 *  userId: Integer corresponding to `user_account_id` in database
 *  orgId: Integer corresponding to `organisation_id` in database
 *  add: Role to add to given user at given organisation. Must be member of `RoleEnum` enumeration
 *  rm: Role to remove to given user at given organisation. Must be member of `RoleEnum` enumeration
 *
 * Note: Including the argument separator `--` before any of the flags is important.
 *       Without it, the argument parsing will not work.
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import Roles from '../src/auth/roles';
import { getConfig } from '../config';

process.on('unhandledRejection', (err) => { throw err; });

const { userId, orgId, add, rm } = parse(process.argv.slice(2));

if (!userId || !orgId || !(add || rm)) {
  throw new Error('Not enough arguments supplied');
}

(async () => {
  const { knex: config } = getConfig(process.env.NODE_ENV);
  const client = Knex(config);

  try {
    await client.transaction(async (trx) => {
      if (add) {
        console.log(await Roles.add(trx, {
          userId: Number(userId),
          organisationId: Number(orgId),
          role: (<any> add),
        }));
      }

      if (rm) {
        console.log(await Roles.remove(trx, {
          userId: Number(userId),
          organisationId: Number(orgId),
          role: (<any> rm),
        }));
      }
    });

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }

  await client.destroy();
})();
