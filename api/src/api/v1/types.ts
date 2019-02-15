import * as Hapi from 'hapi';
import { Dictionary } from 'ramda';
import { ApiRequestQuery, ApiRequestBody } from './schema/request';
import { ApiResponse } from './schema/response';
import { StandardUserCredentials } from '../../auth/strategies/standard';
import { ExternalAppCredentials } from '../../auth/strategies/external';
import { RoleEnum } from '../../auth/types';
import { GenderEnum, CommunityBusiness, User, CommonTimestamps, VolunteerLog } from '../../models';
import { Omit } from '../../types/internal';
import { RegionEnum, SectorEnum } from '../../models/types';


declare module 'hapi' {
  interface UserCredentials extends StandardUserCredentials {}
  interface AppCredentials extends ExternalAppCredentials {}
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

export enum AppEnum {
  TWINE_API = 'TWINE_API',
  VISITOR = 'VISITOR_APP',
  VOLUNTEER = 'VOLUNTEER_APP',
  ADMIN = 'ADMIN_APP',
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
  query: ApiRequestQuery & {
    [k: string]: any
  };
}

export interface GetCommunityBusinessesRequest extends Hapi.Request {
  query: ApiRequestQuery & {
    [k: string]: any
  };
}

export interface RegisterCommunityBusinessesRequest extends Hapi.Request {
  payload: {
    orgName: string
    region: RegionEnum
    sector: SectorEnum
    address1: string
    address2: string
    townCity: string
    postCode: string
    turnoverBand: string
    _360GivingId: string
    adminName: string
    adminEmail: string
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
      visitActivity?: string
      name?: string
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
  payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'qrCode'>>;
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
    fields: (keyof VolunteerLog)[]
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface PostMyVolunteerLogsRequest extends Hapi.Request {
  payload: Pick<VolunteerLog, 'activity' | 'duration' | 'startedAt'> & {
    userId?: number | 'me'
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

export interface GetVolunteerLogSummaryRequest extends Hapi.Request {
  query: { since: string, until: string };
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
    isAnonymous?: boolean
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
  payload: (
    Pick<VolunteerLog, 'id' | 'activity' | 'duration' | 'startedAt' | 'deletedAt'> &
    { userId: number | string }
  )[];
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface GetMyVolunteerProjectRequest extends Hapi.Request {
  params: {
    projectId: string
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface PostMyVolunteerProjectRequest extends Hapi.Request {
  payload: {
    name: string
  };
  pre: {
    communityBusiness: CommunityBusiness
  };
}

export interface PutMyVolunteerProjectRequest extends Hapi.Request {
  params: {
    projectId: string
  };
  payload: {
    name: string
  };
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
