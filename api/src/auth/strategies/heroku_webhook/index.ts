import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';

const validateHerokuWebhook =
  async (request: Hapi.Request, token: string, h: Hapi.ResponseToolkit) => {
    const { server: { app: { config } } } = request;

    return config.webhooks.heroku.secret === token
    ? { isValid: true, credentials: { user: 'heroku' } }
    : Boom.forbidden('Error with authentication for 3rd party clients');
  };

export default validateHerokuWebhook;
