/*
 * User API functional tests
 */
import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';

describe('POST /users/password/forgot', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  const mockEmailService = jest.fn();
  mockEmailService.mockReturnValueOnce({
    To: '1@aperturescience.com',
    SubmittedAt: 'today',
    MessageID: '10100101',
  });

  beforeAll(async () => {
    server = await init(config);
    server.app.EmailService.send = mockEmailService;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('::SUCCESS email sent with reset token', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/password/forgot',
      payload: { email: '1@aperturescience.com' },
    });

    expect(res.statusCode).toBe(200);
    expect(mockEmailService.mock.calls.length).toBe(1);
    expect(mockEmailService.mock.calls[0][0]).toEqual(expect.objectContaining({
      from: 'visitorapp@powertochange.org.uk',
      templateId: '4148361',
      templateModel: expect.objectContaining({
        email: '1@aperturescience.com',
      }),
      to: '1@aperturescience.com'}));
    expect(mockEmailService.mock.calls[0][0].templateModel.token).toBeTruthy();
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
