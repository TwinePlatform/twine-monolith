/*
 * Twine API entry point
 */
import ch from 'chalk';
import { inspect } from 'util';
import { compose, tap } from 'ramda';
import { init, start } from './server';
import { getConfig } from '../config';


process.on('unhandledRejection', (reason) => {
  console.error(ch.bgRed.whiteBright('Unhandled Promise Rejection'));
  console.error(reason);
  process.exit(1);
});

const logConfig = (config: any) => {
  console.log(`\nAttempting to start twine-api in "${ch.bgBlue.white(config.env)}" environment.`);
  console.log('\n\nUsing the following configuration');
  console.log(inspect(config, { depth: 4 }));
};

const up = compose(
  (p) => p.then(start),
  init,
  tap(logConfig),
  getConfig
);

(async () => {
  try {
    const server = await up(process.env.NODE_ENV);

    process.on('SIGINT', async () => {
      try {
        await server.shutdown();
        console.log('\n\nServer shutdown.');
        process.exit(0);

      } catch (error) {
        console.error(`\n\n❌ ${ch.bgRed.white('Could not shutdown server gracefully')}`);
        console.error(error);
        process.exit(1);

      }
    });

    console.log('\n\n' + ch.green(`twine-api listening on ${server.info.uri}`));
  } catch (error) {
    console.error(error);
  }
})();
