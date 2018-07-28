/*
 * Global setup for Jest test runner
 *
 * This is run once before any tests run and before the framework is
 * installed into the runtime
 */
const knex = require('knex');
const { getConfig } = require('../build/config');
const { migrate } = require('../database');

const config = getConfig(process.env.NODE_ENV);
const client = knex(config.knex);

module.exports = async () => {
  await migrate.teardown();
  await client.migrate.latest();
  await client.seed.run();
};
