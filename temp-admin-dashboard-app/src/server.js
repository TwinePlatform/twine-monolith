const path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Handlebars = require('handlebars');
const HapiAuthCookie = require('hapi-auth-cookie');
const routes = require('./routes');

module.exports = async (config) => {
  const server = new Hapi.Server(config.web);

  await server.register([
    HapiAuthCookie,
    Inert,
    {
      plugin: Vision,
      options: {
        engines: { hbs: Handlebars },
        relativeTo: config.root,
        path: 'templates',
        partialsPath: path.join('templates', 'partials'),
        helpersPath: path.join('templates', 'helpers'),
        layout: true,
      },
    },
  ]);

  server.auth.strategy('session', 'cookie', {
    password: 'fooooooo',
    ttl: 1000 * 60 * 60, // 1 hour
    clearInvalid: true,
    keepAlive: true,
    isSecure: true,
    isHttpOnly: true,
    redirectTo: '/login',
    appendNext: true,
    validateFunc: async () => ({ valid: true }),
  });

  server.route(routes);

  return server;
};
