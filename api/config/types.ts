import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as JWT from 'jsonwebtoken';


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

type EmailConfig = {
  postmark_key: string
};

type AuthConfig = {
  standard: {
    jwt: {
      secret: string
      signOptions?: JWT.SignOptions
      verifyOptions?: JWT.VerifyOptions
      decodeOptions?: JWT.DecodeOptions
    }
    cookie: {
      name: string,
      options: Hapi.ServerStateCookieOptions
    }
  }
};

type QrCodeConfig = {
  secret: string
};

export type Config = {
  root: string
  env: Environment
  web: WebConfig
  knex: Knex.Config
  email: EmailConfig
  auth: AuthConfig
  qrcode: QrCodeConfig
};
