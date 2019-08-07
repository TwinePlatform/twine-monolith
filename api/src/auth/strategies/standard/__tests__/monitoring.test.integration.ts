import { getConfig } from '../../../../../config';
import { createListener } from '../monitoring';
import { delay } from 'twine-util/time';

describe('REDIS', () => {
  const config = getConfig(process.env.NODE_ENV);
  test('TEST', async () => {
    const client = await createListener(config);
    await client.set('foo', 1, 'PX', 500);
    await delay(1000);
    await client.disconnect();
  });
});
