/*
 * Redis configuration
 */
import * as Redis from 'ioredis';
import { getConfig, Config } from '../../config';


export const configureRedis = async (_config?: Config) => {
  const config = _config ? _config : getConfig(process.env.NODE_ENV);
  const client = new Redis(config.cache.session.options.url);

  // Enable keyspace events (see docs/sessions#redis)
  try {
    await client.config('set', 'notify-keyspace-events', 'AKE');

  } catch (error) {
    console.error(error);

  } finally {
    await client.quit();

  }
};


if (require.main === module) {
  configureRedis();
}
