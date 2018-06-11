const { getConfig } = require('./config');

module.exports = getConfig(process.env).knex;
