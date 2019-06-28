import * as CatboxRedis from '@hapi/catbox-redis';
import { Config } from '../../../config';


export const SessionCacheConfig = (config: Config) => {
  return {
    name: 'session-cache',
    provider: {
      constructor: CatboxRedis,
      options: {
        ...config.redis,
        partition: 'sess',
      },
    },
  };
};


export default (config: Config) => [
  SessionCacheConfig(config),
];
