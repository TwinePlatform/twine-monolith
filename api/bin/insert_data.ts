/*
 * DB CLI
 */
import * as parse from 'minimist';
import * as Joi from 'joi';
import * as Knex from 'knex';
import { getConfig } from '../config';
import { insertData } from '../database/tools';


process.on('unhandledRejection', (reason) => { throw reason; });

(async () => {
  const { _: args } = parse(process.argv.slice(2));
  const config = getConfig(process.env.NODE_ENV);
  const client = Knex(config.knex);

  try {

    const result = Joi.array().length(1).items(Joi.only('demo', 'test')).validate(args);
    if (result.error) {
      throw result.error;
    }

    await insertData(config, client, result.value[0] || 'demo');

  } catch (error) {
    console.log('Stopping, something went wrong:\n\n');
    console.log(error);

  }

  await client.destroy();

})();
