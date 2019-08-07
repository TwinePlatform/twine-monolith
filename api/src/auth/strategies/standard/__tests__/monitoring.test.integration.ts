import * as Redis from 'ioredis';
import { delay } from 'twine-util/time';
import { getConfig } from '../../../../../config';
import { createListener } from '../monitoring';

describe('REDIS', () => {
  const config = getConfig(process.env.NODE_ENV);
  test('TEST', async () => {
    const client = new Redis(config.cache.session.options.url);
    const listener = new Redis(config.cache.session.options.url);
    listener.psubscribe('__keyevent@0__:expired', <any> ((...args: any[]) => {
      console.log(...args);
    }));
    await client.set('foo', JSON.stringify({ id: 1, msg: 'hah' }), 'PX', 500);
    await delay(1000);
    await client.disconnect();
  });
});
