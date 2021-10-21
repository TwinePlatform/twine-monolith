/*
 * Type declarations for the models
 */
import * as Knex from 'knex';
import { Maybe, Dictionary, Float, Int } from '../types/internal';
import { PermissionLevelEnum } from '../auth';
import { AccessEnum, ResourceEnum } from '../auth/types';
import { Duration } from 'twine-util';

/*
 * Common and utility types
 */
export type Weekday =
  'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type VisitSignInType = 'sign_in_with_name' | 'qr_code';

export type Coordinates = {
  lat: Float;
  lng: Float;
};

export type CommonTimestamps = {
  createdAt: string;
  modifiedAt?: string;
  deletedAt?: string;
};

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum DisabilityEnum {
  YES = 'yes',
  NO = 'no',
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum EthnicityEnum {
  PREFER_NOT_TO_SAY = 'prefer not to say',
}

export enum RegionEnum {
  EAST_MIDLANDS = 'East Midlands',
  EAST_ENGLAND = 'East of England',
  LONDON = 'London',
  NORTH_EAST = 'North East',
  NORTH_WEST = 'North West',
  SOUTH_EAST = 'South East',
  SOUTH_WEST = 'South West',
  WEST_MIDLANDS = 'West Midlands',
  YORKSHIRE_HUMBER = 'Yorkshire and the Humber',
  TEMPORARY_DATA = 'TEMPORARY DATA',
}

export enum SectorEnum {
  ART_CENTRE = 'Arts centre or facility',
  COMMUNITY_HUB = 'Community hub, facility or space',
  PUB_SHOP_CAFE = 'Community pub, shop or café',
  EMPLOYMENT_SUPPORT = 'Employment, training, business support or education',
  ENERGY = 'Energy',
  ENVIRONMENT = 'Environment or nature',
  FOOD = 'Food catering or production (incl. farming)',
  HEALTH = 'Health, care or wellbeing',
  HOUSING = 'Housing',
  FINANCIAL = 'Income or financial inclusion',
  SPORT = 'Sport & leisure',
  TRANSPORT = 'Transport',
  TOURISM = 'Visitor facilities or tourism',
  WASTE_RECYCLING = 'Waste reduction, reuse or recycling',
  TEMPORARY_DATA = 'TEMPORARY DATA',
}

export enum RoleEnum {
  VISITOR = 'VISITOR',
  VOLUNTEER = 'VOLUNTEER',
  VOLUNTEER_ADMIN = 'VOLUNTEER_ADMIN',
  CB_ADMIN = 'CB_ADMIN',
  FUNDING_BODY = 'FUNDING_BODY',
  TWINE_ADMIN = 'TWINE_ADMIN',
  SYS_ADMIN = 'SYS_ADMIN',
}

/*
 * Database row definitions
 */
export type UserRow = {
  'user_account.user_account_id': string;
  'user_account.user_name': string;
  'user_account.user_password': string;
  'user_account.email': string;
  'user_account.qr_code': string;
  'user_account.birth_year': number;
  'user_account.post_code': string;
  'user_account.phone_number': string;
  'user_account.is_email_confirmed': boolean;
  'user_account.is_phone_number_confirmed': boolean;
  'user_account.is_email_contact_consent_granted': boolean;
  'user_account.is_sms_contact_consent_granted': boolean;
  'user_account.created_at': string;
  'user_account.modified_at': string;
  'user_account.deleted_at': string;
  'gender.gender_name': string;
  'ethnicity.ethnicity_name': string;
  'disability.disability_name': string;
  'user_account.is_temp': boolean;
};

export type OrganisationRow = {
  'organisation.organisation_id': string;
  'organisation.organisation_name': string;
  'organisation._360_giving_id': string;
  'organisation.created_at': string;
  'organisation.modified_at': string;
  'organisation.deleted_at': string;
  'organisation.is_temp': boolean;
};

export type CommunityBusinessRow = {
  'community_business.organisation_id': string;
  'organisation.organisation_name': string;
  'organisation._360_giving_id': string;
  'community_business_region.region_name': string;
  'community_business_sector.sector_name': string;
  logo_url: string;
  address_1: string;
  address_2: string;
  town_city: string;
  post_code: string;
  coordinates: string;
  turnover_band: string;
  'community_business.created_at': string;
  'community_business.modified_at': string;
  'community_business.deleted_at': string;
  'organisation.is_temp': boolean;
};

export type ApiTokenRow = {
  api_token: string;
  api_token_access: string;
  api_token_name: string;
};


/*
 * Base declarations
 *
 * Declarations of the basic shape of each model. Not used directly
 * but combined with other declarations
 */
export type User = Readonly<CommonTimestamps & {
  id?: Int;
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  qrCode?: string;
  gender: GenderEnum;
  disability: DisabilityEnum;
  ethnicity: EthnicityEnum;
  birthYear?: Int | null;
  postCode?: string;
  isEmailConfirmed: boolean;
  isPhoneNumberConfirmed: boolean;
  isEmailConsentGranted: boolean;
  isSMSConsentGranted: boolean;
  isTemp: boolean;
}>;

export type Organisation = Readonly<CommonTimestamps & {
  id: Int;
  name: string;
  _360GivingId: string;
  isTemp?: boolean;
}>;

export type CommunityBusiness = Organisation & Readonly<{
  region: RegionEnum;
  sector: SectorEnum;
  logoUrl: string;
  address1: string;
  address2: string;
  townCity: string;
  postCode: string;
  coordinates: Coordinates;
  turnoverBand: string;
  adminCode?: string;
}>;

export type FundingBody = Organisation;

export type VisitActivity = Readonly<CommonTimestamps & {
  id: Int;
  name: string;
  category: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}>;

export type VisitEvent = Readonly<CommonTimestamps & {
  id: Int;
  userId: Int;
  visitActivityId: Int;
}>;

export type LinkedVisitEvent = VisitEvent & Readonly<{
  visitActivity: string
  category: string
}>;

export type Feedback = Readonly<CommonTimestamps & {
  id: Int;
  score: -1 | 0 | 1;
}>;

export type LinkedFeedback = Feedback & Readonly<{
  organisationId: Int;
}>;

export type SingleUseToken = Readonly<Omit<CommonTimestamps, 'modifiedAt'> & {
  id: Int;
  userId: Int;
  token: string;
  expiresAt: string;
  usedAt?: string;
}>;

export type VolunteerActivity = Readonly<CommonTimestamps & {
  id: Int;
  name: string;
}>;

export type VolunteerProject = Readonly<CommonTimestamps & {
  id: Int;
  name: string;
  organisationId: Int;
}>;

export type VolunteerLog = Readonly<CommonTimestamps & {
  id: Int;
  userId: Int;
  createdBy?: Int;
  userName?: string;
  organisationId: Int;
  organisationName?: string;
  activity: string;
  project?: string;
  duration: Duration.Duration;
  startedAt: string;
  note?: string;
}>;

export type ApiToken = Readonly<CommonTimestamps & {
  id: Int;
  name: string;
  access: string;
  token: string;
}>;


export type Model =
  User
  | Organisation
  | CommunityBusiness
  | FundingBody
  | VisitActivity
  | VisitEvent
  | LinkedVisitEvent
  | Feedback
  | LinkedFeedback
  | SingleUseToken
  | VolunteerLog;


/*
 * Model collection declaration
 *
 * Defines a common interface through which to operate on a
 * collection of model objects
 */
export type Collection<T extends Model> = {
  toColumnNames: (a: Partial<Record<keyof T, any>>) => Dictionary<any>;
  create: (a: Partial<T>) => T;
  exists: (c: Knex, a?: ModelQuery<T>) => Promise<boolean>;
  get: (c: Knex, a?: ModelQuery<T>) => Promise<T[]>;
  getOne: (c: Knex, a?: ModelQuery<T>) => Promise<Maybe<T>>;
  update: (c: Knex, a: Partial<T>, b: Partial<T>) => Promise<T>;
  add: (c: Knex, a: Partial<T>, b?: string) => Promise<T>;
  destroy: (c: Knex, a: Partial<T>) => Promise<Int>;
};

type UsersBaseCollection = Collection<User>;

export type UserCollection = UsersBaseCollection & {
  isMemberOf: (k: Knex, u: User, cb: CommunityBusiness) => Promise<boolean>;
  updateToken: (c: Knex, a: any, b: any) => Promise<any>;
  getWithEmail: (c: Knex, email: any) => Promise<any>;
};

export type VisitorCollection = UsersBaseCollection & {
  getWithVisits: (k: Knex, c: CommunityBusiness, q?: ModelQuery<User>, a?: string) =>
    Promise<(Partial<User> & { visits: LinkedVisitEvent[] })[]>;
  fromCommunityBusiness: (client: Knex, c: CommunityBusiness, q?: ModelQuery<User>) =>
    Promise<User[]>;
  addWithRole: (k: Knex, c: CommunityBusiness, a: Partial<User>) => Promise<User>;
  addAnonymousWithRole: (k: Knex, c: CommunityBusiness, a: Partial<User>) => Promise<User>;
};

export type VolunteerCollection = UsersBaseCollection & {
  fromCommunityBusiness: (client: Knex, c: CommunityBusiness, q?: ModelQuery<User>) =>
    Promise<Partial<User>[]>;
  fromProjectWithToken: (client: Knex, c: CommunityBusiness, vp: string) =>
    // fromProjectWithToken: (client: Knex, c: CommunityBusiness, q?: ModelQuery<User>) =>
    Promise<Partial<User>[]>;
  fromRecentProjectWithToken: (client: Knex, c: CommunityBusiness, vp: string) => Promise<any>;
  addWithRole: (
    k: Knex,
    u: Partial<User>,
    vt: RoleEnum.VOLUNTEER | RoleEnum.VOLUNTEER_ADMIN,
    cb: CommunityBusiness,
    c?: string
  ) => Promise<User>;
  adminCodeIsValid: (k: Knex, c: CommunityBusiness, code: string) => Promise<boolean>;
};

export type CbAdminCollection = UsersBaseCollection & {
  fromOrganisation: (k: Knex, q: Partial<Organisation>) => Promise<User[]>;
  addWithRole: (k: Knex, c: CommunityBusiness, a: Partial<User>) => Promise<User>;
  addTemporaryWithRole: (k: Knex, c: CommunityBusiness) => Promise<User>;
};

export type OrganisationCollection = Collection<Organisation> & {
  fromUser: (k: Knex, q: ModelQuery<User>) => Promise<Organisation>;
};

export type CommunityBusinessCollection = Collection<CommunityBusiness> & {
  addFeedback: (k: Knex, c: CommunityBusiness, score: Int) => Promise<LinkedFeedback>;
  getFeedback: (
    k: Knex,
    c: CommunityBusiness,
    bw?: Partial<DateTimeQuery & ModelQueryInvariant>
  ) => Promise<LinkedFeedback[]>;
  getVisitActivities: (k: Knex, c: CommunityBusiness, d?: Weekday) => Promise<VisitActivity[]>;
  getVisitActivityById: (k: Knex, c: CommunityBusiness, id: Int) => Promise<Maybe<VisitActivity>>;
  getVisitActivityByName: (k: Knex, c: CommunityBusiness, name: string) => Promise<Maybe<VisitActivity>>;
  addVisitActivity: (k: Knex, v: Partial<VisitActivity>, c: Partial<CommunityBusiness>)
    => Promise<Maybe<VisitActivity>>;
  addVolunteerActivity: (k: Knex, a: object) => any;
  addVolunteerProject: (k: Knex, a: object, b: string) => any;
  activityExists: (k: Knex, b: string) => any;
  projectExists: (k: Knex, b: string, orgId: any) => any;
  updateVisitActivity: (k: Knex, a: Partial<VisitActivity>) => Promise<Maybe<VisitActivity>>;
  deleteVisitActivity: (k: Knex, i: Int) => Promise<Maybe<VisitActivity>>;
  addVisitLog: (k: Knex, v: VisitActivity, u: Partial<User>, a: 'sign_in_with_name' | 'qr_code') =>
    Promise<VisitEvent>;
  // TODO [getVisitLogsWithUsers]:
  // this is still wrong, we return "category", which is missing
  getVisitLogsWithUsers: (k: Knex, c: CommunityBusiness, q?: ModelQuery<LinkedVisitEvent & User>) =>
    Promise<Partial<LinkedVisitEvent & Pick<User, 'birthYear' | 'gender'>>[]>;
  getVisitLogAggregates: (
    k: Knex,
    c: CommunityBusiness,
    aggs: string[],
    q?: ModelQuery<LinkedVisitEvent & User>) => Promise<any>;
  getTemporary: (k: Knex) => Promise<Pick<CommunityBusiness, 'id' | 'name'> & CommonTimestamps>;
  addTemporary: (k: Knex, n: string) => Promise<CommunityBusiness>;
};

export type VolunteerLogCollection = Collection<VolunteerLog> & {
  getSimple: (c: Knex, a: string) => Promise<VolunteerLog>;
  updateNotes: (c: Knex, a: string, b: any) => Promise<VolunteerLog>;
  projectToColumnNames: (a: Partial<Record<keyof VolunteerProject, any>>) => Dictionary<any>;
  fromUser: (
    k: Knex,
    u: User,
    q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>;
  fromCommunityBusiness: (
    k: Knex,
    c: CommunityBusiness,
    q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>;
  getOwn: (k: Knex,
    c: CommunityBusiness,
    q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>;
  fromUserAtCommunityBusiness: (
    k: Knex,
    u: User, c: CommunityBusiness,
    q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>;
  recordInvalidLog: (
    k: Knex,
    u: User,
    c: CommunityBusiness,
    payload: object) => Promise<void>;
  getProjects: (
    k: Knex,
    c: CommunityBusiness,
    q?: ModelQuery<VolunteerProject>) => Promise<VolunteerProject[]>;
  addProject: (
    k: Knex,
    c: CommunityBusiness,
    name: string) => Promise<VolunteerProject>;
  updateProject: (
    k: Knex,
    p: VolunteerProject,
    c: Partial<VolunteerProject>) => Promise<VolunteerProject[]>;
  deleteProject: (
    k: Knex,
    p: VolunteerProject) => Promise<Int>;
  restoreProject: (
    k: Knex,
    p: VolunteerProject) => Promise<Int>;
  syncLogs: (
    k: Knex,
    c: CommunityBusiness,
    u: User,
    ls: Partial<VolunteerLog>[]) => Promise<{ synced: Int; ignored: Int }>;
};


/*
 * Input query types
 */
type QueryResponse = Dictionary<any>;
export type PermissionTuple = {
  permissionLevel: PermissionLevelEnum;
  access: AccessEnum;
  resource: ResourceEnum;
};

type PermissionQuery = PermissionTuple & { role: RoleEnum };
type UserPermissionQuery = Omit<PermissionQuery, 'role'> & { userId: number };
type RolesPermissionQuery = { roles: RoleEnum[]; accessMode?: 'full' | 'restricted' };


type RoleQuery = {
  role: RoleEnum;
  userId: number;
  organisationId: number;
};
type RolesQuery = { role: RoleEnum | RoleEnum[]; userId: number; organisationId: number };
type MoveRoleQuery = Omit<RoleQuery, 'role'> & { from: RoleEnum; to: RoleEnum };
type UserRoleQuery = Omit<RoleQuery, 'role'>;

export type RolesCollection = {
  add: (k: Knex, a: RoleQuery) => Promise<QueryResponse>;

  remove: (k: Knex, a: RoleQuery) => Promise<QueryResponse>;

  move: (k: Knex, a: MoveRoleQuery) => Promise<QueryResponse>;

  userHas: (k: Knex, u: User, r: RoleEnum) => Promise<boolean>;

  userHasAtCb: (k: Knex, a: RolesQuery) => Promise<boolean>;

  fromUser: (k: Knex, a: User) => Promise<{ organisationId: Int; role: RoleEnum }[]>;

  fromUserWithOrg: (k: Knex, a: UserRoleQuery) => Promise<RoleEnum[]>;

  toDisplay: (r: RoleEnum) => string;
};

export type PermissionCollection = {
  grantExisting: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>;

  grantNew: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>;

  revoke: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>;

  roleHas: (k: Knex, a: PermissionQuery) => Promise<boolean>;

  userHas: (k: Knex, a: UserPermissionQuery) => Promise<boolean>;

  forRoles: (k: Knex, a: RolesPermissionQuery) => Promise<PermissionTuple[]>;
};

export type TokenCollection = {
  create: (k: Knex, u: User, t: string) => Promise<SingleUseToken>;
  createPasswordResetToken: (k: Knex, u: User) => Promise<SingleUseToken>;
  createConfirmAddRoleToken: (k: Knex, u: User) => Promise<SingleUseToken>;
  use: (k: Knex, e: string, t: string, tb: string) => Promise<null>;
  usePasswordResetToken: (k: Knex, e: string, t: string) => Promise<null>;
  useConfirmAddRoleToken: (k: Knex, e: string, t: string) => Promise<null>;
};


/*
 * Model query declarations
 */
export type WhereQuery<T> = Partial<T>;
export type WhereBetweenQuery<T> = {
  [k in keyof T]?: [number | Date, number | Date]
};
export type DateTimeQuery = {
  since: Date;
  until: Date;
  userId: number;
};

type ModelQueryInvariant = {
  limit: number;
  offset: number;
  order: [string, 'asc' | 'desc'];
};

export type ModelQuery<T> = Partial<ModelQueryInvariant & DateTimeQuery & {
  where: WhereQuery<T>;
  whereNot: WhereQuery<T>;
  whereBetween: WhereBetweenQuery<T>;
  whereNotBetween: WhereBetweenQuery<T>;
  fields: (keyof T)[];
}>;
