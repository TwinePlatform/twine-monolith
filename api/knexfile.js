const { getConfig } = require('./build/config');

module.exports = getConfig(process.env.NODE_ENV).knex;
