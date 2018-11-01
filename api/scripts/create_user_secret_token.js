// script for creating a new user locally
const Knex = require('knex')
const {Users} = require('../build/src/models/user');
const {getConfig} = require('../build/config')

const go = async() => {
  const {knex: config} = getConfig('development')
  
  const client = Knex(config)
  
  const user = await Users.getOne(client, { where: { id: 1 }})
  await Users.createPasswordResetToken(client, user)

  return client.destroy();
}

go();