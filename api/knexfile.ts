import { getConfig } from './config';

module.exports = getConfig(process.env.NODE_ENV).knex;
