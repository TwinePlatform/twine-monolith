import * as CatboxRedis from '@hapi/catbox-redis';
import { Config } from '../config';


export const SessionCacheConfig = (config: Config) => {
  return {
    name: 'session-cache',
    provider: {
      constructor: CatboxRedis,
      options: {
        ...config.cache.session,
        partition: 'sess',
      },
    },
  };
};


export default (config: Config) => [
  SessionCacheConfig(config),
];
