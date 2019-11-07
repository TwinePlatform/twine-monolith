/*
 * Anonymise database
 *
 * Anonymises user data by:
 * - Replacing user name with user ID
 * - Replacing email
 * - Setting phone number to null
 *
 * All CB_ADMIN users are given login details:
 * - email: "admin@<CBNAME>.com" where CBNAME is the lower-case community business name (no spaces)
 *
 * Usage:
 *   NODE_ENV=ENV npm run exec bin/anonymise_data.ts -- --password=PASSWORD
 *
 * Flags:
 *  password: Password set for all users
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { getConfig } from '../config';
import { Users, Organisations } from '../src/models';
import Roles from '../src/models/role';
import { RoleEnum } from '../src/models/types';


process.on('unhandledRejection', (err) => { throw err; });


const { password } = parse(process.argv.slice(2));

if (!password) {
  throw new Error('Missing arguments');
}


(async () => {
  const { knex: config } = getConfig(process.env.NODE_ENV);
  const client = Knex(config);

  const users = await Users.get(client);

  try {

    await client.transaction(async (trx) => {
      await Promise.all(users.map(async (user) => {
        const org = await Organisations.fromUser(client, { where: { id: user.id } });
        const roles = await Roles.fromUserWithOrg(client, { userId: user.id, organisationId: org.id });
        const name = `User ${String(user.id)}`;
        const isAdmin = roles.some((role => role === RoleEnum.CB_ADMIN));

        if (org === null) {
          throw new Error(`User ${user.name} has no organisation`);
        }

        const email = isAdmin
          ? `admin@${org.name.toLowerCase().replace(/ /g, '').replace('é', 'e').replace(/[:&'-_]/g, '')}.com`
          : `${name}@example.com`;

        const anon = Object.assign({}, user, { name, email, password, phoneNumber: null });

        console.log(`Anonymising user: ${user.name} -- ${user.email}`);
        return Users.update(trx, user, anon);
      }));

    });

  } catch (error) {

    console.log('Error:');
    console.log(error);


  } finally {

    await client.destroy();

  }
})();
