/*
 * Configuration defaults
 *
 * Can also hold non-secret, environment-invariant configuration
 * Merged into environment-specific configurations
 */
const path = require('path');
const { DEVELOPMENT } = require('./environments');


module.exports = {
  root: path.resolve(__dirname, '..'),
  env: DEVELOPMENT,
  web: {
    host: 'localhost',
    port: 1000,
    tls: null,
  },
  knex: {
    client: 'pg',
    connection: {
      host: null,
      port: null,
      database: null,
      user: null,
      ssl: false,
    },
  },
};
