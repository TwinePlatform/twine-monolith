import * as Hapi from 'hapi';
import { User, Organisation } from '../../../models';
import { RoleEnum } from '../../types';


export type UserCredentials = {
  scope?: string[]
  user?: User
  organisation?: Organisation
  role?: RoleEnum
  session?: Session
};

export type PrivilegeLevel = 'full' | 'restricted';

export type Session = {
  userId: number
  organisationId: number
  privilege: PrivilegeLevel
  iat: number
  exp: number
};

export type JwtPayload = Session;

export type Token = string;

export type TTokenManager = {
  create: (s: Pick<Session, 'userId' | 'organisationId' | 'privilege'>) => Token
  verify: (t: Token) => Session
  decode: (t: Token) => Session
};

export type TSessionManager = {
  create: (
    request: Hapi.Request,
    res: Hapi.ResponseObject,
    p: Pick<Session, 'userId' | 'organisationId'>,
    level?: PrivilegeLevel
  ) => Hapi.ResponseObject
  refresh: (request: Hapi.Request, res: Hapi.ResponseObject) => Hapi.ResponseObject
  destroy: (request: Hapi.Request, res: Hapi.ResponseObject) => Hapi.ResponseObject
  escalate: (request: Hapi.Request, res: Hapi.ResponseObject) => Hapi.ResponseObject
  deescalate: (request: Hapi.Request, res: Hapi.ResponseObject) => Hapi.ResponseObject
};
