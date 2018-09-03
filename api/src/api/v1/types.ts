import * as Hapi from 'hapi';
import { Dictionary } from 'ramda';
import { ApiRequestQuery, ApiRequestBody } from './schema/request';
import { ApiResponse } from './schema/response';
import { UserCredentials } from '../../auth/strategies/standard';
import { GenderEnum } from '../../models';


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
 * Request types
 */
export interface OrganisationRequest extends Hapi.Request {
  params: {
    organisationId: string
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
    email: string,
    password: string,
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
