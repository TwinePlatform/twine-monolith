#!/usr/bin/env node

/*
 * script for creating a new user
 */
const parse = require('minimist');
const Knex = require('knex')
const { Users, CommunityBusinesses } = require('../build/src/models');
const { Roles } = require('../build/src/auth');
const { getConfig } = require('../build/config')

process.on('unhandledRejection', (err) => { throw err });

const { name, email, role, password, oid } = parse(process.argv.slice(2));

if (!name || !email || !role || !password || !oid) {
  throw new Error('Missing arguments');
}

(async () => {
  const {knex: config} = getConfig(process.env.NODE_ENV)
  const client = Knex(config)

  try {
    await client.transaction(async (trx) => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: oid } });

      if (!cb) {
        throw new Error(`Community Business with ID ${oid} does not exist`)
      }

      const user = await Users.add(trx, Users.create({ name, email, password }));

      await Roles.add(trx, { userId: user.id, organisationId: cb.id, role });

      console.log(`
        User added to ${process.env.NODE_ENV} database:
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
