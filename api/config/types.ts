import * as Hapi from '@hapi/hapi';
import { CatboxRedisOptions } from '@hapi/catbox-redis';
import * as Knex from 'knex';
import * as Yar from '@hapi/yar';
import { AppEnum } from '../src/types/internal';


export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

type WebConfig = {
  host: string
  port: number | string
  router: { stripTrailingSlash: boolean }
  routes: {
    cors: Hapi.RouteOptionsCors
    security: Hapi.RouteOptionsSecureObject | boolean
  },
  tls?: null | { key: string, cert: string }
};

type PlatformConfig = {
  domains: {
    [AppEnum.ADMIN]: string
    [AppEnum.DASHBOARD]: string
    [AppEnum.TWINE_API]: string
    [AppEnum.VISITOR]: string
    [AppEnum.VOLUNTEER]: null
  }
};

type EmailConfig = {
  postmarkKey: string
  fromAddress: string
  developers: string []
};

type AuthConfig = {
  schema: {
    session_cookie: {
      options: Yar.YarOptions
    }
  }
};

type QrCodeConfig = {
  secret: string
};

type CacheConfig = {
  session: { name: string, options: CatboxRedisOptions };
};

type WebHooksConfig = {
  heroku: {
    secret: string
  }
};

export type Config = {
  root: string
  env: Environment
  web: WebConfig
  platform: PlatformConfig
  knex: Knex.Config
  cache: CacheConfig
  email: EmailConfig
  auth: AuthConfig
  qrcode: QrCodeConfig
  webhooks: WebHooksConfig
};
