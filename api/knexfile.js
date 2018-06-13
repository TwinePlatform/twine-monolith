const { getConfig } = require('./config');

module.exports = getConfig(process.env.NODE_ENV).knex;
