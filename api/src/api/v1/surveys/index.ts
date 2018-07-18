import * as Hapi from 'hapi';

export default [
  {
    method: 'GET',
    path: '/surveys/cls',
    options: {
      description: 'Retreive cls data',
      auth: {
        strategy: 'external',
        access: {
          scope: ['frontline'],
        },
      },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return '';
    },
  },
];
