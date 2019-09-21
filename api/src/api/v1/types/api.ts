import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { Dictionary } from 'ramda';
import { ApiRequestQuery } from '../schema/request';
import { GenderEnum, CommunityBusiness, User, CommonTimestamps, VolunteerLog } from '../../../models';
import { CbAdminCollection, CommunityBusinessCollection, Weekday, VisitActivity, VisitEvent, VolunteerLogCollection, VisitorCollection, VolunteerCollection, UserCollection } from '../../../models/types';
import { Unpack } from '../../../types/internal';
import { Duration } from 'twine-util/duration';

interface ServerRoute<
  TRequest extends Hapi.Request,
  TResponse extends Hapi.Lifecycle.ReturnValue
  > extends Hapi.ServerRoute {
  handler: (req: TRequest, h: Hapi.ResponseToolkit, e?: Error) => Promise<Boom<null> | TResponse>;
}


export namespace Api {

  type ResponsePayload<T, U = null> = U extends null
    ? ({ meta: object; result: T } | T)
    : ({ meta: U; result: T } | T);

  /*
   * CommunityBusinesses route types
   */

  export namespace CommunityBusinesses {
    export namespace GET {
      export interface Request extends Hapi.Request { query: ApiRequestQuery & Dictionary<any> }
      export type Result = Unpack<ReturnType<CommunityBusinessCollection['serialise']>>[];
      export type Response = ResponsePayload<Result>;
      export type Route = ServerRoute<Request, Response>;
    }

    export namespace Me {
      export namespace GET {
        export interface Request extends Hapi.Request {
          query: ApiRequestQuery & Dictionary<any>;
          pre: { communityBusiness: CommunityBusiness };
        }
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['serialise']>>;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace PUT {
        export interface Request extends Hapi.Request {
          payload:
            Partial<Omit<CommunityBusiness, 'createdAt' | 'modifiedAt' | 'deletedAt' | 'id' | '_360GivingId'>>;
          pre: {
            communityBusiness: CommunityBusiness;
          };
        }
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['serialise']>>;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace Feedback {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: ApiRequestQuery & { since: string; until: string };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getFeedback']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: { feedbackScore: number };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['addFeedback']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace Aggregates {
          export namespace GET {
            export interface Request extends Hapi.Request {
              query: { since: string; until: string };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = { totalFeedback: number; '-1': number; 0: number; 1: number };
            export type Response = ResponsePayload<Result>;
            export type Route = ServerRoute<Request, Response>;
          }
        }
      }

      export namespace VisitActivities {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: { day: Weekday | 'today' };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getVisitActivities']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: Pick<VisitActivity, 'name' | 'category'>;
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['addVisitActivity']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace PUT {
          export interface Request extends Hapi.Request {
            params: { visitActivityId: string };
            pre: { communityBusiness: CommunityBusiness };
            payload: Partial<Omit<VisitActivity, 'id' | 'createdAt' | 'modifiedAt' | 'deletedAt'>>;
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['updateVisitActivity']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace DELETE {
          export interface Request extends Hapi.Request {
            params: { visitActivityId: string };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['deleteVisitActivity']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }
      }

      export namespace VisitLogs {
        export namespace GET {
          export interface Request extends Hapi.Request {
            pre: { communityBusiness: CommunityBusiness };
            query: ApiRequestQuery & Dictionary<any> & {
              filter?: {
                age?: [number, number];
                gender?: GenderEnum;
                activity?: string;
              };
            };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getVisitLogsWithUsers']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace POST {
          export interface Request extends Hapi.Request {
            pre: { communityBusiness: CommunityBusiness };
            payload: Pick<VisitEvent, 'userId' | 'visitActivityId'> & {
              signInType: 'sign_in_with_name' | 'qr_code';
            };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['addVisitLog']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }

        export namespace Aggregates {
          export namespace GET {
            export type Request = VisitLogs.GET.Request;
            export type Result = Unpack<ReturnType<CommunityBusinessCollection['getVisitLogAggregates']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }
        }
      }

      export namespace VolunteerLogs {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: ApiRequestQuery<VolunteerLog> & { since: string; until: string };
            pre: {
              communityBusiness: CommunityBusiness;
            };
          }
          export type Result = Unpack<ReturnType<VolunteerLogCollection['serialise']>>[];
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: Pick<VolunteerLog, 'activity' | 'duration' | 'startedAt' | 'project'> & {
              userId?: VolunteerLog['userId'] | 'me';
            };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Unpack<ReturnType<VolunteerLogCollection['serialise']>>;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace sync {
          export namespace POST {
            export interface Request extends Hapi.Request {
              payload: (
                Pick<VolunteerLog, 'id' | 'activity' | 'duration' | 'startedAt' | 'deletedAt' | 'project'> &
                Pick<VolunteerLog, 'project' | 'startedAt' | 'deletedAt'> &
                { userId?: VolunteerLog['userId'] | 'me' }
              )[];
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = { ignored: number; synced: number };
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }
        }

        export namespace summary {
          export namespace GET {
            export interface Request extends Hapi.Request {
              query: { since: string; until: string };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = { volunteers: number; volunteeredTime: Duration }
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }
        }

        export namespace Id {
          export namespace GET {
            export interface Request extends Hapi.Request {
              query: ApiRequestQuery<VolunteerLog>;
              params: { logId: string };
              pre: {
                communityBusiness: CommunityBusiness;
              };
            }
            export type Result = Unpack<ReturnType<VolunteerLogCollection['serialise']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace PUT {
            export interface Request extends Hapi.Request {
              params: { logId: string };
              payload: Partial<Pick<VolunteerLog, 'activity' | 'duration' | 'project' | 'startedAt'>>;
              pre: {
                communityBusiness: CommunityBusiness;
              };
            }
            export type Result = Unpack<ReturnType<VolunteerLogCollection['serialise']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace DELETE {
            export interface Request extends Hapi.Request {
              params: { logId: string };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = null;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }
        }
      }

      export namespace Visitors {
        export namespace Id {
          export namespace GET {
            export interface Request extends Hapi.Request {
              params: { userId: string };
              query: { visits?: string };
              pre: { communityBusiness: CommunityBusiness; isChildUser: boolean };
            }
            export type Result = Unpack<ReturnType<VisitorCollection['serialise']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace emails {
            export namespace POST {
              export interface Request extends Hapi.Request {
                params: { userId: string };
                payload: { type: 'qrcode' };
                pre: { isChild: boolean };
              }
              export type Result = null;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }
          }
        }
      }

      export namespace Volunteers {
        export namespace Projects {
          export namespace GET {
            export interface Request extends Hapi.Request {
              query: { since: string; until: string };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = Unpack<ReturnType<VolunteerLogCollection['getProjects']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace POST {
            export interface Request extends Hapi.Request {
              payload: { name: string };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = Unpack<ReturnType<VolunteerLogCollection['addProject']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace Id {
            export namespace GET {
              export interface Request extends Hapi.Request {
                params: { projectId: string };
                pre: { communityBusiness: CommunityBusiness };
              }
              export type Result = Unpack<Unpack<ReturnType<VolunteerLogCollection['getProjects']>>>;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }

            export namespace PUT {
              export interface Request extends Hapi.Request {
                params: { projectId: string };
                payload: { name: string };
                pre: { communityBusiness: CommunityBusiness };
              }
              export type Result = Unpack<Unpack<ReturnType<VolunteerLogCollection['updateProject']>>>;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }

            export namespace DELETE {
              export interface Request extends Hapi.Request {
                params: { projectId: string };
                pre: { communityBusiness: CommunityBusiness };
              }
              export type Result = null;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }
          }
        }
      }
    }

    export namespace Id {
      export namespace GET {
        export interface Request extends Hapi.Request {
          query: ApiRequestQuery & Dictionary<any>;
          pre: {
            communityBusiness: CommunityBusiness;
            isChild: boolean;
          };
        }
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['serialise']>>;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace PUT {
        export interface Request extends Hapi.Request {
          payload:
            Partial<Omit<CommunityBusiness, 'createdAt' | 'modifiedAt' | 'deletedAt' | 'id' | '_360GivingId'>>;
          pre: {
            communityBusiness: CommunityBusiness;
            isChild: boolean;
          };
        }
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['serialise']>>;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace Feedback {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: ApiRequestQuery & { since: string; until: string };
            pre: {
              communityBusiness: CommunityBusiness;
              isChild: boolean;
            };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getFeedback']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }
      }

      export namespace VisitActivities {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: { day: Weekday | 'today' };
            pre: { communityBusiness: CommunityBusiness; isChild: boolean };
            params: { organisationId: string };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getVisitActivities']>>;
          export type Response = ResponsePayload<Result>;
          export type Route = ServerRoute<Request, Response>;
        }
      }

      export namespace Visitors {
        export namespace GET {
          export interface Request extends Hapi.Request {
            params: { organisationId: string | 'me' };
            query: ApiRequestQuery & {
              filter?: Partial<{
                age: [number, number];
                gender: GenderEnum;
                name: string;
                email: string;
                postCode: string;
                phoneNumber: string;
                visitActivity: string;
              }>;
              visits?: boolean;
            };
            pre: { communityBusiness: CommunityBusiness; isChild: boolean };
          }
          export type Result = Unpack<ReturnType<VisitorCollection['serialise']>>[];
          export type Meta = { total: number }
          export type Route = ServerRoute<Request, ResponsePayload<Result, Meta>>;
        }

        export namespace Id {
          export namespace PUT {
            export interface Request extends Hapi.Request {
              params: { organisationId: string | 'me'; userId: string };
              payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'qrCode'>>;
              pre: { communityBusiness: CommunityBusiness; isChild: boolean };
            }
            export type Result = Unpack<ReturnType<VisitorCollection['serialise']>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }
        }
      }

      export namespace Volunteers {
        export namespace GET {
          export interface Request extends Hapi.Request {
            params: { organisationId: string | 'me' };
            query: ApiRequestQuery;
            pre: { communityBusiness: CommunityBusiness; isChild: boolean };
          }
          export type Result = Unpack<ReturnType<VolunteerCollection['serialise']>>[];
          export type Meta = { total: number };
          export type Route = ServerRoute<Request, ResponsePayload<Result, Meta>>;
        }
      }
    }

    export namespace Register {
      export namespace POST {
        export interface Request extends Hapi.Request {
          payload:
            Omit<CommunityBusiness, 'createdAt' | 'modifiedAt' | 'deletedAt' | 'id'>
            & {
              orgName: CommunityBusiness['name'];
              adminName: string;
              adminEmail: string;
            };
        }
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['serialise']>>;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace Temporary {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: { orgName: string };
            pre: { isChild: boolean };
          }
          export type Result = { communityBusiness: CommunityBusiness; cbAdmin: User };
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }
    }

    export namespace CbAdmins {
      export namespace GET {
        export interface Request extends Hapi.Request { payload: {} }
        export type Result = Unpack<ReturnType<CbAdminCollection['serialise']>>[];
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }
    }

    export namespace Temporary {
      export namespace GET {
        export interface Request extends Hapi.Request {
          pre: { isChild: boolean };
        }
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['getTemporary']>>;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }

      export namespace Id {
        export namespace DELETE {
          export interface Request extends Hapi.Request {
            params: { organisationId: string };
            pre: { communityBusiness: CommunityBusiness; isChild: boolean };
          }
          export type Result = null;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace Password {
          export namespace Reset { // eslint-disable-line
            export namespace GET { // eslint-disable-line
              export interface Request extends Hapi.Request {
                params: { organisationId: string };
                pre: { communityBusiness: CommunityBusiness; isChild: boolean };
              }
              export type Result = Unpack<ReturnType<UserCollection['update']>>;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }
          }
        }
      }
    }
  }

// export interface LoginRequest extends Hapi.Request {
//   payload: {
//     restrict?: RoleEnum | RoleEnum[]
//     type: 'cookie' | 'body'
//     email: string
//     password: string
//   };
// }

// export interface PutUserRequest extends Hapi.Request {
//   payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'qrCode'>>;
//   params: {
//     userId: string
//   };
// }
// export interface GetAllVolunteersRequest extends Hapi.Request {
//   query: ApiRequestQuery & {
//     [k: string]: string
//   };
// }

// export interface DeleteUserRequest extends Hapi.Request {
//   params: {
//     userId: string
//   };
// }

// export interface RegisterRequest extends Hapi.Request {
//   payload: {
//     organisationId: number
//     name: string
//     gender: GenderEnum
//     birthYear: number
//     email: string
//     phoneNumber: string
//     postCode: string
//     emailConsent: boolean
//     smsConsent: boolean
//     isAnonymous?: boolean
//   };
//   pre: {
//     communityBusiness: CommunityBusiness
//   };
// }
// export interface RegisterConfirm extends Hapi.Request {
//   payload: {
//     organisationId: number
//     userId: number
//     token: string
//     role: RoleEnum
//   };
// }

// export interface VolunteerRegisterRequest extends Hapi.Request {
//   payload: RegisterRequest['payload'] & {
//     password: string
//     role: RoleEnum.VOLUNTEER | RoleEnum.VOLUNTEER_ADMIN
//     adminCode?: string
//   };
// }

// /*
//  * Test related types
//  */
// export type RouteTestFixture = {
//   name: string
//   setup?: (server: Hapi.Server) => Promise<void>
//   teardown?: (server: Hapi.Server) => Promise<void>
//   inject: {
//     url: string
//     method: HttpMethodEnum
//     credentials?: Hapi.AuthCredentials
//     payload?: object
//   }
//   expect: {
//     statusCode: number
//     payload?: object | ((a: Dictionary<any>) => void),
//   }
// }
}
