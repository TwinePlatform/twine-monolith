import * as Hapi from 'hapi';

export default [
  {
    method: 'GET',
    path: '/',
    options: {
      description: 'A splash page, of sorts',
    },
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return 'This is the Twine API Home page';
    },
  },
];
