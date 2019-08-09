import * as IoRedis from 'ioredis';
import * as URL from 'url';
import { Config } from '../../../../config';


const createListener = async (url: string) => {
  const client = new IoRedis(url);
  const getter = new IoRedis(url);

  client.subscribe('__keyevent@0__:set', <any> ((...args: any[]) => {
    console.log('SET', ...args);
  }));

  client.subscribe('__keyevent@0__:expired', <any> ((...args: any[]) => {
    console.log('EXPIRED', ...args);
  }));

  client.on('message', <any> (async (...args: any[]) => {
    console.log('MESSAGE', ...args);
    switch (args[0]) {
      case '__keyevent@0__:expired':
        const x = await getter.get(args[1]);
        console.log('GOT', x);
        break;

      default:
        break;
    }
  }));

  return client;
};

createListener('redis://localhost:6379');
