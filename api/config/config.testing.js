const path = require('path');

module.exports = {
  web: {
    port: 4001,
  },
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL_TESTING,
    pool: {
      min: 3,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, '..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '..', 'database', 'seeds', 'testing'),
    },
  },
};
