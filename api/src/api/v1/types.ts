import * as Hapi from 'hapi';
import { Dictionary } from 'ramda';
import { ApiRequestQuery, ApiRequestBody } from './schema/request';
import { ApiResponse } from './schema/response';
import { UserCredentials } from '../../auth/strategies/standard';
import { RoleEnum } from '../../auth/types';
import { GenderEnum, CommunityBusiness, User, CommonTimestamps, VolunteerLog } from '../../models';
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

export interface DeleteUserRequest extends Hapi.Request {
  params: {
    userId: string
  };
}


export interface GetMyVolunteerLogsRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    since: string
    until: string
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface PostMyVolunteerLogsRequest extends Hapi.Request {
  payload: Pick<VolunteerLog, 'activity' | 'duration' | 'startedAt'> & {
    userId?: number
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface GetVolunteerLogRequest extends Hapi.Request {
  query: { fields: (keyof VolunteerLog)[] };
  params: { logId: string };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface PutMyVolunteerLogRequest extends Hapi.Request {
  params: { logId: string };
  payload: Partial<Omit<VolunteerLog, 'id' | 'userId' | 'organisationId' | keyof CommonTimestamps>>;
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface RegisterRequest extends Hapi.Request {
  payload: {
    organisationId: number
    name: string
    gender: GenderEnum
    birthYear: number
    email: string
    phoneNumber: string
    postCode: string
    emailConsent: boolean
    smsConsent: boolean
  };
}

export interface VolunteerRegisterRequest extends Hapi.Request {
  payload: RegisterRequest['payload'] & {
    password: string
    role: RoleEnum.VOLUNTEER | RoleEnum.VOLUNTEER_ADMIN
    adminCode?: string
  };
}

export interface GetMyVolunteerLogsAggregateRequest extends Hapi.Request {
  query: ApiRequestQuery & Hapi.Util.Dictionary<string>;
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface SyncMyVolunteerLogsRequest extends Hapi.Request {
  payload: Pick<VolunteerLog, 'id' | 'activity' | 'duration' | 'startedAt'>[];
  pre: {
    communityBusiness: CommunityBusiness
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
