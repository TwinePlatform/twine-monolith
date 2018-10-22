const { getConfig } = require('../config');
const init = require('./server');

(async () => {
  try {
    const config = getConfig(process.env.NODE_ENV);
    const server = await init(config);
    await server.start();

    console.log(`Server running at ${server.info.uri}`);
  } catch (error) {
    console.log('Oops!');
    console.log(error);

  }
})();
