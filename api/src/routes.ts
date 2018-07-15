import * as Hapi from 'hapi';

const routes: Hapi.ServerRoute [] = [
  {
    method: 'GET',
    path: '/',
    options: {
      description: 'A splash page, of sorts',
      auth: false,
    },
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return 'This is the Twine API Home page';
    },
  },
];

export default routes;
