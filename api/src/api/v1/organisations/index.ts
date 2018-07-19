import * as Hapi from 'hapi';

export default [
  {
    method: 'GET',
    path: '/organisations',
    options: {
      description: 'Retreive list of all organisations',
      auth: {
        strategy: 'standard',
        access: {
          scope: ['organisations_details-child:read'],
        },
      },
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return '';
    },
  },
];
