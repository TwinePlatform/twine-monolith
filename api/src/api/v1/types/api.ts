import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { Dictionary } from 'ramda';
import { Duration } from 'twine-util/duration';
import { ApiRequestQuery } from '../schema/request';
import { GenderEnum, CommunityBusiness, User, CommonTimestamps, VolunteerLog } from '../../../models';
import {
  CommunityBusinessCollection,
  Weekday,
  VisitActivity,
  VisitEvent,
  VolunteerLogCollection,
  UserCollection,
  RoleEnum,
  LinkedVisitEvent,
  Organisation,
  VisitSignInType
} from '../../../models/types';
import { Unpack, AppEnum, Maybe } from '../../../types/internal';
import { Serialisers } from '../serialisers';


interface ServerRoute<
  TRequest extends Hapi.Request,
  TResponse extends Hapi.Lifecycle.ReturnValue
  > extends Hapi.ServerRoute {
  handler: (req: TRequest, h: Hapi.ResponseToolkit, e?: Error) => Promise<Boom<null> | TResponse>;
}

type ResponsePayload<T, U = null> = U extends null
  ? ({ meta: object; result: T } | T)
  : ({ meta: U; result: T } | T);

export namespace Api {

  export namespace Invite {
    export namespace Email {
      export namespace POST {
        export interface Request extends Hapi.Request {
          payload: any;
        }
        export type Response = any;
        export type Route = ServerRoute<Request, Response>;
      }
    }
  }

  export namespace CommunityBusinesses {
    export namespace GET {
      export interface Request extends Hapi.Request { query: ApiRequestQuery & Dictionary<any> }
      export type Result = CommunityBusiness[];
      export type Response = ResponsePayload<Result>;
      export type Route = ServerRoute<Request, Response>;
    }

    export namespace Me {

      export namespace GET {
        export interface Request extends Hapi.Request {
          query: ApiRequestQuery & Dictionary<any>;
          pre: { communityBusiness: CommunityBusiness };
        }
        export type Result = CommunityBusiness;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace PUT {
        export interface Request extends Hapi.Request {
          payload:
          Partial<Omit<CommunityBusiness, 'createdAt' | 'modifiedAt' | 'deletedAt' | 'id' | '_360GivingId'>>;
          pre: { communityBusiness: CommunityBusiness };
        }
        export type Result = CommunityBusiness;
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
              signInType: VisitSignInType;
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
          export type Result = VolunteerLog[];
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: Pick<VolunteerLog, 'activity' | 'duration' | 'startedAt' | 'project'> & {
              userId?: VolunteerLog['userId'] | 'me';
            };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = VolunteerLog;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace DELETE {
          export interface Request extends Hapi.Request {
            params: { logId: string };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = VolunteerLog;
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
            export type Result = VolunteerLog;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace PUT {
            export interface Request extends Hapi.Request {
              params: { userId: string, logId: string };
              payload: Partial<Pick<VolunteerLog, 'activity' | 'duration' | 'project' | 'startedAt'>>;
              pre: {
                communityBusiness: CommunityBusiness;
              };
            }
            export type Result = VolunteerLog;
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

        export namespace Note {
          export namespace GET {
            export interface Request extends Hapi.Request {
              query: ApiRequestQuery<VolunteerLog> & { since: string; until: string };
              pre: {
                communityBusiness: CommunityBusiness;
              };
            }
            export type Result = any;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>
          }
        }
      }

      export namespace Badges {
        export namespace GET {
          export interface Request extends Hapi.Request {

          }
          export type Result = any;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace POST {
          export interface Request extends Hapi.Request {
            userId: 'me';
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = any;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace Visitors {
        export namespace Id {
          export namespace GET {
            export interface Request extends Hapi.Request {
              params: { userId: string };
              query: { visits?: string };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = Unpack<ReturnType<typeof Serialisers.visitors.noSecrets>>;
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace emails {
            export namespace POST {
              export interface Request extends Hapi.Request {
                params: { userId: string };
                payload: { type: 'qrcode' };
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
            export namespace Restore {
              export namespace PATCH {
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
    }

    export namespace Id {
      export namespace GET {
        export interface Request extends Hapi.Request {
          query: ApiRequestQuery & Dictionary<any>;
          pre: { communityBusiness: CommunityBusiness };
        }
        export type Result = CommunityBusiness;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }

      export namespace PUT {
        export interface Request extends Hapi.Request {
          payload:
          Partial<Omit<CommunityBusiness, 'createdAt' | 'modifiedAt' | 'deletedAt' | 'id' | '_360GivingId'>>;
          pre: { communityBusiness: CommunityBusiness };
        }
        export type Result = CommunityBusiness;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }

      export namespace Feedback {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: ApiRequestQuery & { since: string; until: string };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getFeedback']>>;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace VisitActivities {
        export namespace GET {
          export interface Request extends Hapi.Request {
            query: { day: Weekday | 'today' };
            pre: { communityBusiness: CommunityBusiness };
            params: { organisationId: string };
          }
          export type Result = Unpack<ReturnType<CommunityBusinessCollection['getVisitActivities']>>;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace Visitors {
        export namespace GET {
          export interface Request extends Hapi.Request {
            params: { organisationId: string | 'me' };
            query: ApiRequestQuery & Dictionary<any>;
            pre: { communityBusiness: CommunityBusiness; isChild: boolean };
          }
          export type Result = User[];
          export type Meta = { total: number }
          export type Route = ServerRoute<Request, ResponsePayload<Result, Meta>>;
        }

        export namespace Id {
          export namespace PUT {
            export interface Request extends Hapi.Request {
              params: { organisationId: string | 'me'; userId: string };
              payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'qrCode'>>;
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = User;
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
          export type Result = Unpack<ReturnType<typeof Serialisers.volunteers.noSecrets>>[];
          export type Meta = { total: number };
          export type Route = ServerRoute<Request, ResponsePayload<Result, Meta>>;
        }
      }

      export namespace PushNotification {
        export namespace GET {
          export interface Request extends Hapi.Request {
            params: {
              organisationId: string | 'me',
              projectId: string
            };
            query: ApiRequestQuery;
            pre: { communityBusiness: CommunityBusiness; isChild: boolean };
          }
          export type Result = Unpack<ReturnType<typeof Serialisers.volunteers.noSecrets>>[];
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
        export type Result = CommunityBusiness;
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }

      export namespace Temporary {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: { orgName: string };
          }
          export type Result = { communityBusiness: CommunityBusiness; cbAdmin: User };
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }
    }

    export namespace CbAdmins {
      export namespace GET {
        export interface Request extends Hapi.Request { payload: {} }
        export type Result = User[];
        export type Response = ResponsePayload<Result>;
        export type Route = ServerRoute<Request, Response>;
      }
    }

    export namespace Temporary {
      export namespace GET {
        export type Request = Hapi.Request;
        export type Result = Unpack<ReturnType<CommunityBusinessCollection['getTemporary']>>;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }

      export namespace Id {
        export namespace DELETE {
          export interface Request extends Hapi.Request {
            params: { organisationId: string };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = null;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace Password {
          export namespace Reset { // eslint-disable-line
            export namespace GET { // eslint-disable-line
              export interface Request extends Hapi.Request {
                params: { organisationId: string };
                pre: { communityBusiness: CommunityBusiness };
              }
              export type Result = Unpack<ReturnType<UserCollection['update']>>;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }
          }
        }
      }
    }
  }

  export namespace Users {
    export namespace GET {
      export type Request = Hapi.Request;
      export type Result = Boom;
      export type Route = ServerRoute<Request, ResponsePayload<Result>>;
    }

    export namespace Login {
      export namespace POST {
        export interface Request extends Hapi.Request {
          payload: {
            restrict?: RoleEnum | RoleEnum[];
            type?: 'cookie' | 'body';
            email: string;
            password: string;
          };
        }
        export type Result = null | { token: string };
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }
    }

    export namespace Logout {
      export namespace GET {
        export type Request = Hapi.Request;
        export type Result = null;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }
    }

    export namespace Password {
      export namespace Forgot {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: {
              email: string;
              redirect: AppEnum.ADMIN | AppEnum.VISITOR | AppEnum.DASHBOARD;
            };
          }
          export type Result = null;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace Reset {
        export namespace POST {
          interface Request extends Hapi.Request {
            payload: {
              email: string;
              token: string;
              password: string;
              passwordConfirm: string;
            };
          }
          export type Result = null;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }
    }

    export namespace Register {
      export namespace Visitors {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: {
              organisationId: number;
              name: string;
              gender: GenderEnum;
              birthYear: Maybe<number>;
              email?: string;
              phoneNumber?: string;
              postCode?: string;
              emailConsent: boolean;
              smsConsent: boolean;
              isAnonymous: boolean;
            };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = User;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace Volunteers {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: {
              organisationId: number;
              name: string;
              email: string;
              password?: string;
              gender: GenderEnum;
              birthYear: Maybe<number>;
              postCode?: string;
              phoneNumber?: string;
              emailConsent: boolean;
              smsConsent: boolean;
              isAnonymous: boolean;
              adminCode?: string;
              role: RoleEnum.VOLUNTEER | RoleEnum.VOLUNTEER_ADMIN;
            };
          }
          export type Result = User;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace Confirm {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: {
              organisationId: number;
              userId: number;
              token: string;
              role: RoleEnum;
            };
          }
          export type Result = User & { token?: string }
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }
    }

    export namespace Visitors {
      export namespace Search {
        export namespace POST {
          export interface Request extends Hapi.Request {
            payload: { qrCode: string };
            pre: { communityBusiness: CommunityBusiness };
          }
          export type Result = Maybe<User>;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }
    }

    export namespace Volunteers {
      export namespace Id {
        export namespace GET {
          export interface Request extends Hapi.Request {
            params: { userId: string };
            pre: { requireSibling: boolean };
          }
          export type Result = User;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace PUT {
          export interface Request extends Hapi.Request {
            params: { userId: string };
            payload: Partial<Omit<User, 'id' | 'createdAt' | 'modifiedAt' | 'deletedAt' | 'qrCode' | 'isTemp'>>;
            pre: { isSibling: boolean };
          }
          export type Result = User;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }

        export namespace DELETE {
          export interface Request extends Hapi.Request {
            params: { userId: string };
            pre: { requireSibling: boolean };
          }
          export type Result = null;
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }

      export namespace Me {
        export namespace VolunteerLogs {
          export namespace GET {
            export interface Request extends Hapi.Request {
              query: Pick<ApiRequestQuery, 'limit' | 'offset'> & {
                since: string;
                until: string;
              };
              pre: { communityBusiness: CommunityBusiness };
            }
            export type Result = VolunteerLog[];
            export type Route = ServerRoute<Request, ResponsePayload<Result>>;
          }

          export namespace Id {
            export namespace GET {
              export interface Request extends Hapi.Request {
                query: Pick<ApiRequestQuery<VolunteerLog>, 'fields'>;
                params: { logId: string };
              }
              export type Result = VolunteerLog;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }

            export namespace PUT {
              export interface Request extends Hapi.Request {
                params: { logId: string };
                payload: Partial<Pick<VolunteerLog, 'duration' | 'activity' | 'startedAt' | 'project'>>;
                pre: { communityBusiness: CommunityBusiness };
              }
              export type Result = VolunteerLog;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }

            export namespace DELETE {
              export interface Request extends Hapi.Request {
                params: { logId: string };
              }
              export type Result = null;
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }
          }

          export namespace Summary {
            export namespace GET {
              export interface Request extends Hapi.Request {
                query: { since: string; until: string };
                params: { logId: string };
              }
              export type Result = { total: Duration };
              export type Route = ServerRoute<Request, ResponsePayload<Result>>;
            }
          }
        }
      }
    }

    export namespace Me {
      export namespace GET {
        export interface Request extends Hapi.Request {
          query: ApiRequestQuery<User>;
        }
        export type Result = User;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }
      export namespace PUT {
        export interface Request extends Hapi.Request {
          payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'qrCode'>>;
        }
        export type Result = User;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }
      export namespace Roles {
        export namespace GET {
          export type Request = Hapi.Request;
          export type Result = { organisationId: number; roles: RoleEnum[] };
          export type Route = ServerRoute<Request, ResponsePayload<Result>>;
        }
      }
    }

    export namespace Id {
      export namespace PUT {
        export interface Request extends Hapi.Request {
          payload: Partial<Omit<User, 'id' | keyof CommonTimestamps | 'qrCode'>>;
        }
        export type Result = User;
        export type Route = ServerRoute<Request, ResponsePayload<Result>>;
      }
      export namespace PUT_simple {
        export interface Request extends Hapi.Request {
          payload: any;
        }
        export type Route = ServerRoute<Request, ResponsePayload<any>>;
      }
    }
  }

  export namespace VisitLogs {
    export namespace GET {
      export interface Request extends Hapi.Request {
        query: { since: string; until: string };
      }
      export type Result =
        Omit<LinkedVisitEvent, 'visitActivityId' | 'modifiedAt' | 'deletedAt'>
        & Pick<VisitActivity, 'category' | 'name'>
        & Pick<User, 'birthYear' | 'gender'>
        & Pick<Organisation, 'id'>;
      export type Route = ServerRoute<Request, ResponsePayload<Result>>;
    }
  }

  export namespace VolunteerLogs {
    export namespace GET {
      export interface Request extends Hapi.Request {
        query: { since: string; until: string };
      }
      export type Result = VolunteerLog[];
      export type Route = ServerRoute<Request, ResponsePayload<Result>>;
    }
  }
}
