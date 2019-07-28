import * as CatboxRedis from '@hapi/catbox-redis';
import { Config } from '../config';


export const SessionCacheConfig = (config: Config) => {
  return {
    name: config.cache.session.name,
    provider: {
      constructor: CatboxRedis,
      options: {
        ...config.cache.session.options,
        partition: config.cache.session.name,
      },
    },
  };
};


export default (config: Config) => [
  SessionCacheConfig(config),
];
