/*
 * User API functional tests
 */
import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';

describe('POST /users/password/forgot', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('::SEMI-SUCCESS cannot send email due to test postmark key', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/password/forgot',
      payload: { email: '1@aperturescience.com' },
    });

    expect(res.statusCode).toBe(502);
  });

  test('::ERROR non existent email', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/password/forgot',
      payload: { email: '1999@aperturescience.com' },
    });

    expect(res.statusCode).toBe(400);
  });
});
