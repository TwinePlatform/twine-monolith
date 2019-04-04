import * as fs from 'fs';
import * as path from 'path';
import * as parse from 'minimist';

process.on('unhandledRejection', (err) => { throw err; });

const { _: args } = parse(process.argv.slice(2));

(async () => {
  const [file] = args;

  if (fs.existsSync(path.join(__dirname, 'reports', file))) {
    try {
      const { default: mod } = await import(path.join(__dirname, 'reports', file));
      await mod();

    } catch (error) {
      console.log('Oops, something went wrong');
      console.log(error);

    }
  } else {
    console.log(`File does not exist: ${path.join(__dirname, 'reports', file)}`);

  }
})();
