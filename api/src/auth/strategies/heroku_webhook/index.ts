import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { createHmac } from 'crypto';

const validateHerokuWebhook =
  async (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit) => {
    const { server: { app: { config } } } = request;
    const error = Boom.forbidden('Error with authentication for 3rd party clients');

    if (config.webhooks.heroku.authToken !== token) {
      return error;
    }
    const signature = request.headers['Heroku-Webhook-Hmac-SHA256'];
    const hmac = createHmac('sha256', config.webhooks.heroku.secret);
    const hashedPayload = hmac.update(JSON.stringify(request.payload)).digest('hex');

    return signature === hashedPayload
      ? { isValid: true, credentials: { user: 'heroku' } }
      : error;
  };

export default validateHerokuWebhook;
