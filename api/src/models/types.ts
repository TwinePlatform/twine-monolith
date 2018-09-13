/*
 * Type declarations for the models
 */
import * as Knex from 'knex';
import { Maybe, Json, Dictionary, Float, Int } from '../types/internal';

/*
 * Common and utility types
 */
export type Coordinates = {
  lat: Float
  lng: Float
};

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
export type UserBase = CommonTimestamps & {
  id?: Int
  name: string
  email?: string
  phoneNumber?: string
  password?: string
  qrCode?: string
  gender: GenderEnum
  disability: string
  ethnicity: string
  birthYear?: Int
  postCode?: string
  isEmailConfirmed: boolean
  isPhoneNumberConfirmed: boolean
  isEmailConsentGranted: boolean
  isSMSConsentGranted: boolean
};

export type OrganisationBase = CommonTimestamps & {
  id: Int
  name: string
  _360GivingId: string
};

export type CommunityBusinessBase = CommonTimestamps & OrganisationBase & {
  region: string
  sector: string
  logoUrl: string
  address1: string
  address2: string
  townCity: string
  postCode: string
  coordinates: Coordinates
  turnoverBand: string
};

export type SubscriptionBase = CommonTimestamps & {
  id: Int
  type: string
  status: string
  expiresAt: string
};

export type VisitActivityBase = CommonTimestamps & {
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
};

export type VisitEventBase = CommonTimestamps & {
  id: Int
  userId: Int
  visitActivityId: Int
};

export type LinkedVisitEventBase = VisitEventBase & {
  visitActivity: string
};

export type FeedbackBase = CommonTimestamps & {
  id: Int
  score: -1 | 0 | 1
};

export type LinkedFeedbackBase = FeedbackBase & {
  organisationId: Int
};

export type OutreachMeetingBase = CommonTimestamps & {
  id: Int
  partner: string
  subject: string
  scheduledAt: string
};

export type OutreachCampaignBase = CommonTimestamps & {
  id: Int
  type: string
  targets: string[]
  startsAt: string
  endsAt: string
};

/*
 * Read-only model declarations
 *
 * Used directly as model representations
 */
export type User = Readonly<UserBase>;
export type Organisation = Readonly<OrganisationBase>;
export type CommunityBusiness = Readonly<CommunityBusinessBase>;
export type Subscription = Readonly<SubscriptionBase>;
export type VisitActivity = Readonly<VisitActivityBase>;
export type VisitEvent = Readonly<VisitEventBase>;
export type LinkedVisitEvent = Readonly<LinkedVisitEventBase>;
export type Feedback = Readonly<FeedbackBase>;
export type LinkedFeedback = Readonly<LinkedFeedbackBase>;
export type OutreachMeeting = Readonly<OutreachMeetingBase>;
export type OutreachCampaign = Readonly<OutreachCampaignBase>;

/*
 * Change-set declarations
 *
 * Used directly to describe changes to be made to existing models
 */
export type UserChangeSet = Partial<UserBase>;
export type OrganisationChangeSet = Partial<OrganisationBase>;
export type CommunityBusinessChangeSet = Partial<CommunityBusinessBase>;
export type OutreachMeetingChangeSet = Partial<OutreachMeetingBase>;
export type OutreachCampaignChangeSet = Partial<OutreachCampaignBase>;

/*
 * Model relations declarations
 *
 * Declare which models have relations to other models
 */
export type UserRelations =
  OutreachMeeting
  | Organisation;

export type OrganisationRelations =
  CommunityBusiness
  | User
  | Subscription;

export type CommunityBusinessRelations =
  Subscription
  | OutreachCampaign;

export type Model =
  User
  | Organisation
  | CommunityBusiness;

export type ChangeSet =
  UserChangeSet
  | OrganisationChangeSet;

export type Relation =
  UserRelations
  | OrganisationRelations
  | CommunityBusinessRelations;


/*
 * Model collection declaration
 *
 * Defines a common interface through which to operate on a
 * collection of model objects
 */
export type Collection<T extends Model, K extends ChangeSet, V extends Relation> = {
  toColumnNames: (a: Partial<T>) => Dictionary<any>
  create: (a: Partial<T>) => T
  exists: (c: Knex, a?: ModelQuery<T>) => Promise<boolean>
  get: (c: Knex, a?: ModelQuery<T>) => Promise<T[]>
  getOne: (c: Knex, a?: ModelQuery<T>) => Promise<Maybe<T>>
  update: (c: Knex, a: T, b: K) => Promise<T>
  add: (c: Knex, a: Partial<T>) => Promise<T>
  destroy: (c: Knex, a: Partial<T>) => Promise<void>
  serialise: (a: T) => Promise<Json>
};

export type UserCollection =
  Collection<User, UserChangeSet, UserRelations>;
export type OrganisationCollection =
  Collection<Organisation, OrganisationChangeSet, OrganisationRelations>;
export type CommunityBusinessCollection =
  Collection<CommunityBusiness, CommunityBusinessChangeSet, CommunityBusinessRelations>;


/*
 * Model query declarations
 */
export type WhereQuery<T> = Partial<T>;
export type WhereBetweenQuery<T> = {
  [k in keyof T]?: [string, string]
};
export type DateTimeQuery = {
  since: Date
  until: Date
};
export type ModelQuery<T> = Partial<{
  where: WhereQuery<T>
  whereNot: WhereQuery<T>
  whereBetween: WhereBetweenQuery<T>
  whereNotBetween: WhereBetweenQuery<T>
  limit: number
  offset: number
  order: [string, 'asc' | 'desc']
  fields: (keyof T)[]
}>;
