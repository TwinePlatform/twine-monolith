import * as Knex from 'knex';
import { Maybe, Json, Dictionary } from '../types/internal';


export type Coordinates = {
  lat: number
  lng: number
};

type CommonTimestamps = {
  createdAt: string
  modifiedAt?: string
  deletedAt?: string
};

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
  organisation_id: string
  organisation_name: string
  _360_giving_id: string
  created_at: string
  modified_at: string
  deleted_at: string
};

export type CommunityBusinessRow = {
  community_business_id: string
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

export type UserBase = CommonTimestamps & {
  id?: number
  name: string
  email?: string
  phoneNumber?: string
  password?: string
  qrCode?: string
  gender: string
  disability: string
  ethnicity: string
  birthYear?: number
  postCode?: string
  isEmailConfirmed: boolean
  isPhoneNumberConfirmed: boolean
  isEmailConsentGranted: boolean
  isSMSConsentGranted: boolean
};

export type OrganisationBase = CommonTimestamps & {
  id: number
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

export type Subscription = CommonTimestamps & {
  id: number
  type: string
  status: string
  expiresAt: string
};

export type VisitActivity = CommonTimestamps & {
  id: number
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

export type VisitEvent = CommonTimestamps & {
  id: number
};

export type OutreachMeetingBase = CommonTimestamps & {
  id: number
  partner: string
  subject: string
  scheduledAt: string
};

export type OutreachCampaignBase = CommonTimestamps & {
  id: number
  type: string
  targets: string[]
  startsAt: string
  endsAt: string
};

export type User = Readonly<UserBase>;
export type UserChangeSet = Partial<UserBase>;

export type Organisation = Readonly<OrganisationBase>;
export type OrganisationChangeSet = Partial<OrganisationBase>;

export type CommunityBusiness = Readonly<CommunityBusinessBase>;
export type CommunityBusinessChangeSet = Partial<CommunityBusinessBase>;

export type OutreachMeeting = Readonly<OutreachMeetingBase>;
export type OutreachMeetingChangeSet = Partial<OutreachMeetingBase>;

export type OutreachCampaign = Readonly<OutreachCampaignBase>;
export type OutreachCampaignChangeSet = Partial<OutreachCampaignBase>;

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

export type Collection<T extends Model, K extends ChangeSet, V extends Relation> = {
  toColumnNames: (a: Partial<T>) => Dictionary<any>
  create: (a: Partial<T>) => T
  get: (c: Knex, a?: ModelQuery<T>) => Promise<T[]>
  getOne: (c: Knex, a?: ModelQuery<T>) => Promise<Maybe<T>>
  update: (c: Knex, a: T, b: K) => Promise<T>
  add: (c: Knex, a: Partial<T>) => Promise<T>
  destroy: (c: Knex, a: Partial<T>) => Promise<void>
  serialise: (a: T) => Maybe<Json>
};

export type UserCollection =
  Collection<User, UserChangeSet, UserRelations>;
export type OrganisationCollection =
  Collection<Organisation, OrganisationChangeSet, OrganisationRelations>;
export type CommunityBusinessCollection =
  Collection<CommunityBusiness, CommunityBusinessChangeSet, CommunityBusinessRelations>;

type WhereQuery<T> = Partial<T>;
type WhereBetweenQuery<T> = {
  [k in keyof T]?: [string, string]
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
