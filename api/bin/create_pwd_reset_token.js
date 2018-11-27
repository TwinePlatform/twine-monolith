#!/usr/bin/env node

/*
 * script for creating a new password reset token locally
 */

const Knex = require('knex')
const {Users} = require('../build/src/models/user');
const {getConfig} = require('../build/config')

(async () => {
  const {knex: config} = getConfig('development')

  const client = Knex(config)

  const user = await Users.getOne(client, { where: { id: 1 }})
  await Users.createPasswordResetToken(client, user)

  return client.destroy();
})();
