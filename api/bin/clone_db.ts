import * as path from 'path';
import { exists as existsOld } from 'fs';
import { exec as execOld } from 'child_process';
import { promisify } from 'util';
import * as parse from 'minimist';


const exec = promisify(execOld);
const exists = promisify(existsOld);

process.on('unhandledRejection', (err) => { throw err; });

const { _: [dbName], clean } = parse(process.argv.slice(2));

if (!dbName) {
  throw new Error('Missing arguments');
}

(async () => {
  try {
    if (clean) {
      await exec('rm latest.dump');
    }

    await exec(`psql -c "drop database if exists \\"${dbName}\\""`);
    await exec(`createdb ${dbName}`);

    if (await exists(path.resolve(__dirname, '..', 'latest.dump'))) {
      console.log(`Using existing dumpfile`);
    } else {
      await exec(`heroku pg:backups:download -a twine-api`);
    }

    await exec(`pg_restore --clean --no-acl --no-owner -h localhost -d ${dbName} latest.dump`);
  } catch (error) {
    console.log(error);
  }
})();
