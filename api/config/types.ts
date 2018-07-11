import * as Knex from 'knex';

export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

type WebConfig = {
  host: string,
  port: number | string,
  tls: null | { key: string, cert: string }
};

type EmailConfig = {
  postmark_key: string
};

export type Config = {
  root: string
  env: Environment
  web: WebConfig
  knex: Knex.Config
  email: EmailConfig
};
