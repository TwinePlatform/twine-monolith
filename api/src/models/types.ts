/*
 * Type declarations for the models
 */
import * as Knex from 'knex';
import { Maybe, Dictionary, Float, Int, Omit, Map } from '../types/internal';
import { RoleEnum } from '../auth/types';

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

export type Coordinates = {
  lat: Float
  lng: Float
};

export type Duration = Partial<{
  seconds: number
  minutes: number
  hours: number
  days: number
}>;

export type CommonTimestamps = {
  createdAt: string
  modifiedAt?: string
  deletedAt?: string
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
}

/*
 * Database row definitions
 */
export type UserRow = {
  'user_account.user_account_id': string
  'user_account.user_name': string
  'user_account.user_password': string
  'user_account.email': string
  'user_account.qr_code': string
  'user_account.birth_year': number
  'user_account.post_code': string
  'user_account.phone_number': string
  'user_account.is_email_confirmed': boolean
  'user_account.is_phone_number_confirmed': boolean
  'user_account.is_email_contact_consent_granted': boolean
  'user_account.is_sms_contact_consent_granted': boolean
  'user_account.created_at': string
  'user_account.modified_at': string
  'user_account.deleted_at': string
  'gender.gender_name': string
  'ethnicity.ethnicity_name': string
  'disability.disability_name': string
};

export type OrganisationRow = {
  'organisation.organisation_id': string
  'organisation.organisation_name': string
  'organisation._360_giving_id': string
  'organisation.created_at': string
  'organisation.modified_at': string
  'organisation.deleted_at': string
};

export type CommunityBusinessRow = {
  'community_business.organisation_id': string
  'organisation.organisation_name': string
  'organisation._360_giving_id': string
  'community_business_region.region_name': string
  'community_business_sector.sector_name': string
  logo_url: string
  address_1: string
  address_2: string
  town_city: string
  post_code: string
  coordinates: string
  turnover_band: string
  'community_business.created_at': string
  'community_business.modified_at': string
  'community_business.deleted_at': string
};

/*
 * Base declarations
 *
 * Declarations of the basic shape of each model. Not used directly
 * but combined with other declarations
 */
export type User = Readonly<CommonTimestamps & {
  id?: Int
  name: string
  email: string
  phoneNumber?: string
  password?: string
  qrCode?: string
  gender: GenderEnum
  disability: DisabilityEnum
  ethnicity: EthnicityEnum
  birthYear?: Int | null
  postCode?: string
  isEmailConfirmed: boolean
  isPhoneNumberConfirmed: boolean
  isEmailConsentGranted: boolean
  isSMSConsentGranted: boolean
}>;

export type Organisation = Readonly<CommonTimestamps & {
  id: Int
  name: string
  _360GivingId: string
}>;

export type CommunityBusiness = Organisation & Readonly<{
  region: RegionEnum
  sector: SectorEnum
  logoUrl: string
  address1: string
  address2: string
  townCity: string
  postCode: string
  coordinates: Coordinates
  turnoverBand: string
  adminCode?: string
  frontlineWorkspaceId?: string
  frontlineApiKey?: string
}>;

export type FundingBody = Organisation;

export type Subscription = Readonly<CommonTimestamps & {
  id: Int
  type: string
  status: string
  expiresAt: string
}>;

export type VisitActivity = Readonly<CommonTimestamps & {
  id: Int
  name: string
  category: string
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}>;

export type VisitEvent = Readonly<CommonTimestamps & {
  id: Int
  userId: Int
  visitActivityId: Int
}>;

export type LinkedVisitEvent = VisitEvent & Readonly<{
  visitActivity: string
}>;

export type Feedback = Readonly<CommonTimestamps & {
  id: Int
  score: -1 | 0 | 1
}>;

export type LinkedFeedback = Feedback & Readonly<{
  organisationId: Int
}>;

export type OutreachMeeting = Readonly<CommonTimestamps & {
  id: Int
  partner: string
  subject: string
  scheduledAt: string
}>;

export type OutreachCampaign = Readonly<CommonTimestamps & {
  id: Int
  type: string
  targets: string[]
  startsAt: string
  endsAt: string
}>;

export type SingleUseToken = Readonly<Omit<CommonTimestamps, 'modifiedAt'> & {
  id: Int
  userId: Int
  token: string
  expiresAt: string
  usedAt?: string
}>;

export type VolunteerActivity = Readonly<CommonTimestamps & {
  id: Int
  name: string
}>;

export type VolunteerProject = Readonly<CommonTimestamps & {
  id: Int
  name: string
  organisationId: Int
}>;

export type VolunteerLog = Readonly<CommonTimestamps & {
  id: Int
  userId: Int
  userName?: string
  organisationId: Int
  organisationName?: string
  activity: string
  project?: string
  duration: Duration
  startedAt: string
}>;


export type Model =
  User
  | Organisation
  | CommunityBusiness
  | FundingBody
  | Subscription
  | VisitActivity
  | VisitEvent
  | LinkedVisitEvent
  | Feedback
  | LinkedFeedback
  | OutreachMeeting
  | OutreachCampaign
  | SingleUseToken
  | VolunteerLog;


/*
 * Model collection declaration
 *
 * Defines a common interface through which to operate on a
 * collection of model objects
 */
export type Collection<T extends Model> = {
  toColumnNames: (a: Partial<Map<keyof T, any>>) => Dictionary<any>
  create: (a: Partial<T>) => T
  exists: (c: Knex, a?: ModelQuery<T>) => Promise<boolean>
  get: (c: Knex, a?: ModelQuery<T>) => Promise<T[]>
  getOne: (c: Knex, a?: ModelQuery<T>) => Promise<Maybe<T>>
  update: (c: Knex, a: Partial<T>, b: Partial<T>) => Promise<T>
  add: (c: Knex, a: Partial<T>) => Promise<T>
  destroy: (c: Knex, a: Partial<T>) => Promise<Int>
  serialise: (a: Partial<T>) => Promise<Partial<T>>
};

type UsersBaseCollection = Collection<User> & {
  recordLogin: (k: Knex, u: User) => Promise<void>
};

export type UserCollection = UsersBaseCollection & {
  createPasswordResetToken: (k: Knex, u: User) => Promise<SingleUseToken>
  usePasswordResetToken: (k: Knex, e: string, t: string) => Promise<null>
};

export type VisitorCollection = UsersBaseCollection & {
  getWithVisits: (k: Knex, c: CommunityBusiness, q?: ModelQuery<User>, a?: string) =>
    Promise<(Partial<User> & { visits: LinkedVisitEvent[] })[]>
  fromCommunityBusiness: (client: Knex, c: CommunityBusiness, q?: ModelQuery<User>) =>
    Promise<Partial<User>[]>
  addWithRole: (k: Knex, c: CommunityBusiness, a: Partial<User>) => Promise<User>
  addAnonymousWithRole: (k: Knex, c: CommunityBusiness, a: Partial<User>) => Promise<User>
};

export type VolunteerCollection = UsersBaseCollection & {
  fromCommunityBusiness: (client: Knex, c: CommunityBusiness, q?: ModelQuery<User>) =>
    Promise<Partial<User>[]>
  addWithRole: (
    k: Knex,
    u: Partial<User>,
    vt: RoleEnum.VOLUNTEER | RoleEnum.VOLUNTEER_ADMIN,
    cb: CommunityBusiness,
    c?: string
    ) => Promise<User>
  adminCodeIsValid: (k: Knex, c: CommunityBusiness, code: string) => Promise<boolean>
};

export type CbAdminCollection = UsersBaseCollection & {
  fromOrganisation: (k: Knex, q: Partial<Organisation>) => Promise<User[]>;
  addWithRole: (k: Knex, c: CommunityBusiness, a: Partial<User>) => Promise<User>
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
  addVisitActivity: (k: Knex, v: Partial<VisitActivity>, c: Partial<CommunityBusiness>)
    => Promise<Maybe<VisitActivity>>;
  updateVisitActivity: (k: Knex, a: Partial<VisitActivity>) => Promise<Maybe<VisitActivity>>;
  deleteVisitActivity: (k: Knex, i: Int) => Promise<Maybe<VisitActivity>>;
  addVisitLog: (k: Knex, v: VisitActivity, u: Partial<User>) => Promise<VisitEvent>;
  getVisitLogsWithUsers: (k: Knex, c: CommunityBusiness, q?: ModelQuery<LinkedVisitEvent & User>) =>
    Promise<Partial<LinkedVisitEvent & User>[]>;
  getVisitLogAggregates: (
    k: Knex,
    c: CommunityBusiness,
    aggs: string[],
    q?: ModelQuery<LinkedVisitEvent & User>) => Promise<any>;
};

export type VolunteerLogCollection = Collection<VolunteerLog> & {
  fromUser: (
      k: Knex,
      u: User,
      q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>
  fromCommunityBusiness: (
      k: Knex,
      c: CommunityBusiness,
      q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>
  fromUserAtCommunityBusiness: (
      k: Knex,
      u: User, c: CommunityBusiness,
      q?: ModelQuery<VolunteerLog>) => Promise<VolunteerLog[]>
  getProjects: (
    k: Knex,
    c: CommunityBusiness) => Promise<VolunteerProject[]>
  addProject: (
    k: Knex,
    c: CommunityBusiness,
    name: string) => Promise<VolunteerProject>
  updateProject: (
    k: Knex,
    p: VolunteerProject,
    c: Partial<VolunteerProject>) => Promise<VolunteerProject[]>
  deleteProject: (
    k: Knex,
    p: VolunteerProject) => Promise<Int>
};

/*
 * Model query declarations
 */
export type WhereQuery<T> = Partial<T>;
export type WhereBetweenQuery<T> = {
  [k in keyof T]?: [number | Date, number | Date]
};
export type DateTimeQuery = {
  since: Date
  until: Date
};

type ModelQueryInvariant = {
  limit: number
  offset: number
  order: [string, 'asc' | 'desc']
};

export type ModelQuery<T> = Partial<ModelQueryInvariant & DateTimeQuery & {
  where: WhereQuery<T>
  whereNot: WhereQuery<T>
  whereBetween: WhereBetweenQuery<T>
  whereNotBetween: WhereBetweenQuery<T>
  fields: (keyof T)[]
}>;
