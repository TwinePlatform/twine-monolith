#!/usr/bin/env node

/*
 * script for editing an existing user
 */
const parse = require('minimist');
const Knex = require('knex')
const { Users, CommunityBusinesses } = require('../build/src/models');
const { Roles } = require('../build/src/auth');
const { getConfig } = require('../build/config')

process.on('unhandledRejection', (err) => { throw err });

const { userId, email, role, password, oid } = parse(process.argv.slice(2));

if (!userId || !email) {
  throw new Error('One of userId or email must be supplied');
}

(async () => {
  const {knex: config} = getConfig(process.env.NODE_ENV)
  const client = Knex(config)
  const changeEmail = userId && email;

  try {
    await client.transaction(async (trx) => {
      const query = userId ? { id: userId } : { email };
      const user = await Users.getOne(trx, { where: query });

      await Users.update(trx, user, { email: changeEmail ? email : undefined, password });

      if (role && oid) {
        // Add role at organisation
        await Roles.add(trx, { userId, organisationId: oid, role });

      } else if (role && !oid) {
        // Add role at current organisation

      } else if (!role && oid) {
        // Move current role to different organisation

      } else {
        // Do nothing
      }
    });

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }

  await client.destroy();
})();
