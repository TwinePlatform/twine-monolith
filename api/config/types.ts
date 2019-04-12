import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as JWT from 'jsonwebtoken';
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
  platform: PlatformConfig
  knex: Knex.Config
  email: EmailConfig
  auth: AuthConfig
  qrcode: QrCodeConfig
};
