// script for creating a new user locally
const Knex = require('knex')
const {Volunteers} = require('../build/src/models/volunteer');
const {CommunityBusinesses} = require('../build/src/models/community_business.js');
const {getConfig} = require('../build/config')

const go = async() => {
  const {knex: config} = getConfig('development')
  
  const client = Knex(config)
  
  const user = {
    email: 'INSERTEMAIL@EMAIL.COM',
    password: 'Password123!',
    name: 'INSERT NAME'
  }
  const cb = await CommunityBusinesses.getOne(client, {where: {id:1}})
  console.log({cb});
  
  const volunteer = await Volunteers.addWithRole(client, user, 'VOLUNTEER_ADMIN', cb, '10101')
  console.log({volunteer});
  return client.destroy();
}

go()