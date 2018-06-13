const path = require('path');

module.exports = {
  web: {
    port: 4000,
  },
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL_DEVELOPMENT,
    pool: {
      min: 3,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, '..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '..', 'database', 'seeds', 'development'),
    },
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_DEVELOPMENT,
  },
};
