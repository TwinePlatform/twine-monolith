import * as fs from 'fs';
import * as path from 'path';
import * as parse from 'minimist';

process.on('unhandledRejection', (err) => { throw err; });

const { _: args } = parse(process.argv.slice(2));

(async () => {
  const file = fs.readdirSync(path.join(__dirname, 'reports'))
    .find((f) => f === args[0]);

  if (file) {
    try {
      const { default: mod } = await import(path.join(__dirname, 'reports', file));
      // console.log(mod);

      await mod();

    } catch (error) {
      console.log('Oops, something went wrong');
      console.log(error);

    }
  }
})();
