/*
 * Create new user
 *
 * Usage:
 *  npm run exec ./bin/create_user.ts -- [--name=a]
 *                                       [--email=b]
 *                                       [--password=c]
 *                                       [--role=role]
 *                                       [--oid=c]
 *
 * Flags:
 *  name: User name
 *  email: User email
 *  password: User password (unhashed)
 *  role: Role that user should have
 *  oid: Organisation ID of organisation at which to assign role
 *
 * Note: Including the argument separator `--` before any of the flags is important.
 *       Without it, the argument parsing will not work.
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { Users, CommunityBusinesses } from '../src/models';
import { Roles } from '../src/auth';
import { getConfig } from '../config';

process.on('unhandledRejection', (err) => { throw err; });

const { name, email, role, password, oid } = parse(process.argv.slice(2));

if (!name || !email || !role || !password || !oid) {
  throw new Error('Missing arguments');
}

(async () => {
  const { knex: config, env } = getConfig(process.env.NODE_ENV);
  const client = Knex(config);

  try {
    await client.transaction(async (trx) => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: oid } });

      if (!cb) {
        throw new Error(`Community Business with ID ${oid} does not exist`);
      }

      const user = await Users.add(trx, Users.create({ name, email, password }));

      await Roles.add(trx, { userId: user.id, organisationId: cb.id, role });

      console.log(`
        User added to ${env} database:
          ID: ${user.id}
          Name: ${user.name}
          E-mail: ${user.email}
          Password: ${user.password} (${password})
          Community Business: ${cb.name}
          Role: ${role}
      `);
    });

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }

  await client.destroy();
})();
