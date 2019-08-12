/*
 * Global setup for Jest test runner
 *
 * This is run once before any tests run and before the framework is
 * installed into the runtime
 */
import * as Knex from 'knex';
import * as Redis from 'ioredis';
import { getConfig } from '../config';
import { insertData } from '../database/tools';
const { migrate } = require('../database');


module.exports = async () => {
  const config = getConfig(process.env.NODE_ENV);
  const client = Knex(config.knex);
  const redis = new Redis(config.cache.session.options.url);

  await migrate.teardown({ client });
  await client.migrate.latest();
  await insertData(config, client, 'testing');
  await client.destroy();

  await redis.config('set', 'notify-keyspace-events', 'AKE');
  await redis.quit();
};
