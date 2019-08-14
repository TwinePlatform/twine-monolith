import * as Hapi from '@hapi/hapi';
import { createHmac } from 'crypto';

const validateHerokuWebhook =
  async (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit) => {
    const { server: { app: { config } } } = request;

    if (config.webhooks.heroku.authToken !== token) {
      return { isValid: false };
    }
    const signature = request.headers['Heroku-Webhook-Hmac-SHA256'];
    const hmac = createHmac('sha256', config.webhooks.heroku.secret);
    const hashedPayload = hmac.update(JSON.stringify(request.payload)).digest('hex');

    return signature === hashedPayload
      ? { isValid: true, credentials: { user: 'heroku' } }
      : { isValid: false };
  };

export default validateHerokuWebhook;
