import * as parse from 'minimist';
const db = require('../database');


process.on('unhandledRejection', (err) => { throw err; });

const { _: args } = parse(process.argv.slice(2));

const [mod, command] = args[0].split(':');

(async () => {
  try {
    await db[mod][command](...args.slice(1));
    console.log('Done!');
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
  }
})();
