import * as Hapi from 'hapi';
import router from './router';

const server :Hapi.Server = new Hapi.Server({
  port: 3000,
  host: 'localhost',
});

server.route(router);

const init :() => Promise <void> =  async () => {
  try {
    await server.register({
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: true,
      },
    });
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { server, init };
