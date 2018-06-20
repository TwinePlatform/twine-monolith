import * as Joi from 'joi';
import * as Hapi from 'hapi';

export default [
  {
    method: 'GET',
    path: '/',
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return '👋🏽';
    },
  },
  {
    method: 'GET',
    path: '/{aplacetogo}',
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return '🙃';
    },
  },
  {
    method: 'POST',
    path: '/{aplacetogo}',
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return '👾';
    },
    options: {
      validate: {
        payload: {
          hello: Joi.string(),
        },
      },
    },
  },
];
