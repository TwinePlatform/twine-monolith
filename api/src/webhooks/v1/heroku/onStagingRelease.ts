import * as Hapi from '@hapi/hapi';
import * as Joi from '@hapi/joi';


const routes = [

  {
    method: 'POST',
    path: '/heroku/on-staging-release',
    options: {
      description: 'Sends email when heroku app releases to staging',
      auth: {
        strategy: 'herokuWebhook',
      },
      validate:
      {
        payload: {
          data: {
            app: Joi.object({
              name: Joi.string(),
            }),
          },
        },
      },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { EmailService, config } },
        payload,
      } = request;

      await EmailService.webhooks.onHerokuStagingRelease(config, (<any> payload).data.app.name);
      return h.response().code(204);
    },
  },
] as Hapi.ServerRoute[];

export default routes;
