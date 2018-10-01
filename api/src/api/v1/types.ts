import * as Hapi from 'hapi';
import { Dictionary } from 'ramda';
import { ApiRequestQuery, ApiRequestBody } from './schema/request';
import { ApiResponse } from './schema/response';
import { UserCredentials } from '../../auth/strategies/standard';
import { RoleEnum } from '../../auth/types';
import { GenderEnum, CommunityBusiness, User, CommonTimestamps } from '../../models';
import { Omit } from '../../types/internal';


declare module 'hapi' {
  interface AuthCredentials extends UserCredentials {}
}


/*
 * api.json related types
 */
export enum HttpMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type ApiRouteSpec = {
  description: string,
  isImplemented: boolean,
  auth: boolean,
  intendedFor: any,
  scope: string[],
  query: ApiRequestQuery,
  body: ApiRequestBody,
  response: ApiResponse,
};

/*
 * Prereq types
 */
export interface RequireSiblingPreReq extends Hapi.Request {
  params: {
    userId: string
  };
}

/*
 * Request types
 */
export interface GetCommunityBusinessRequest extends Hapi.Request {
  params: {
    organisationId: string
  };
}

export interface PutCommunityBusinesssRequest extends Hapi.Request {
  payload:
    Omit<CommunityBusiness, 'createdAt' | 'modifiedAt' | 'deletedAt' | 'id' | '_360GivingId'>;
  pre: {
    communityBusiness: CommunityBusiness
    isChild?: boolean
  };
}

export interface GetFeedbackRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    since: string
    until: string
  };
}

export interface PostFeedbackRequest extends Hapi.Request {
  payload: {
    feedbackScore: number
  };
}

export interface LoginRequest extends Hapi.Request {
  payload: {
    restrict?: RoleEnum | RoleEnum[]
    type: 'cookie' | 'header'
    email: string
    password: string
  };
}

export interface EscalateRequest extends Hapi.Request {
  payload: {
    password: string
  };
}

export interface GetVisitorsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    [k: string]: any
    filter?: {
      age?: [number, number]
      gender?: GenderEnum
      activity?: string
    }
    visits: boolean
  };
}

export interface GetVisitorRequest extends Hapi.Request {
  params: {
    userId: string
  };
  query: {
    visits: string
  };
}

export interface PutUserRequest extends Hapi.Request {
  payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'password' | 'qrCode'>>;
  params: {
    userId: string
  };
}
export interface GetAllVolunteersRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    [k: string]: string
  };
}

/*
 * Test related types
 */
export type RouteTestFixture = {
  name: string
  setup?: (server: Hapi.Server) => Promise<void>
  teardown?: (server: Hapi.Server) => Promise<void>
  inject: {
    url: string
    method: HttpMethodEnum
    credentials?: Hapi.AuthCredentials
    payload?: object
  }
  expect: {
    statusCode: number
    payload?: object | ((a: Dictionary<any>) => void),
  }
};
