import * as IoRedis from 'ioredis';
import * as URL from 'url';
import { Config } from '../../../../config';


const createListener = async (config: Config) => {
  const opts = URL.parse(config.cache.session.options.url);
  const client = new IoRedis({ port: Number(opts.port), host: opts.host });

  client.psubscribe('*', <any> ((err: any, key: any) => {
    console.log('ALL', err, key);
  }));

  client.psubscribe('__keyevent@0__:set', <any> ((err: any, key: any) => {
    console.log('SET', err, key);
  }));

  client.psubscribe('__keyevent@0__:expired', <any> ((err: any, key: any) => {
    console.log(err);
    console.log(key);
  }));

  return client;
};

export { createListener };
