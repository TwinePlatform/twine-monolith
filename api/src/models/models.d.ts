import * as Knex from 'knex';
import { Maybe, Json, Dictionary } from '../types/internal';


export type Coordinates = {
  lat: number
  lng: number
}

export type UserRow = {
  user_account_id: string
  user_name: string
  user_password: string
  email: string
  qr_code: string
  birth_year: number
  post_code: string
  phone_number: string
  is_email_confirmed: boolean
  is_phone_number_confirmed: boolean
  is_email_contact_consent_granted: boolean
  is_sms_contact_consent_granted: boolean
  created_at: string
  modified_at: string
  deleted_at: string
  'gender.gender_name': string
  'ethnicity.ethnicity_name': string
  'disability.disability_name': string
};

export type OrganisationRow = {
  organisation_id: 'id',
  organisation_name: 'name',
  _360_giving_id: '_360GivingId',
  created_at: 'createdAt',
  modified_at: 'modifiedAt',
  deleted_at: 'deletedAt',
};

export type UserBase = {
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
  createdAt: string
  modifiedAt?: string
  deletedAt?: string
}

export type OrganisationBase = {
  id: number
  name: string
  _360GivingId: string
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type CommunityBusinessBase = {
  id: number
  name: string
  _360GivingId: string
  region: string
  sector: string
  logoUrl: string
  address1: string
  address2: string
  townCity: string
  postCode: string
  coordinates: Coordinates
  turnoverBand: string
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type Subscription = {
  id: number
  type: string
  status: string
  expiresAt: string
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type VisitActivity = {
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
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type VisitEvent = {
  id: number
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type OutreachMeetingBase = {
  id: number
  partner: string
  subject: string
  scheduledAt: string
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type OutreachCampaignBase = {
  id: number
  type: string
  targets: string[]
  startsAt: string
  endsAt: string
  createdAt: string
  modifiedAt: string
  deletedAt: string
}

export type User = Readonly<UserBase>
export type UserChangeSet = Partial<UserBase>

export type Organisation = Readonly<OrganisationBase>
export type OrganisationChangeSet = Partial<OrganisationBase>

export type CommunityBusiness = Readonly<CommunityBusinessBase>
export type CommunityBusinessChangeSet = Partial<CommunityBusinessBase>

export type OutreachMeeting = Readonly<OutreachMeetingBase>
export type OutreachMeetingChangeSet = Partial<OutreachMeetingBase>

export type OutreachCampaign = Readonly<OutreachCampaignBase>
export type OutreachCampaignChangeSet = Partial<OutreachCampaignBase>

export type UserRelations =
  OutreachMeeting
  | Organisation

export type OrganisationRelations =
  CommunityBusiness
  | User
  | Subscription

export type Model = User | Organisation | CommunityBusiness
export type ChangeSet = UserChangeSet | OrganisationChangeSet
export type Relation = UserRelations | OrganisationRelations

export type Collection<T extends Model, K extends ChangeSet, V extends Relation> = {
  toColumnNames: (a: Partial<T>) => Dictionary<any>
  create: (a: Partial<T>) => T
  get: (client: Knex, a?: Partial<T>, opts?: QueryOptions<T>) => Promise<T[]>
  // getOne: (a: Partial<T>) => Promise<Maybe<T>>
  // has: (a: Model) => Promise<boolean>
  // hasOne: (a: Model) => Promise<boolean>
  // hasMany: (a: Model) => Promise<boolean>
  // update: (a: T, b: V) => Promise<T>
  // add: (a: V) => Promise<T>
  // destroy: (a: T) => Promise<void>
  serialise: (a: T) => Maybe<Json>
  // deserialise: (a: Json) => Maybe<T>
  // toJSON: (a: T) => Maybe<Json>
  // fromJSON: (a: Json) => Maybe<T>
}
export type UserCollection = Collection<User, UserChangeSet, UserRelations>
export type OrganisationCollection = Collection<Organisation, OrganisationChangeSet, OrganisationRelations>

export type CommonQueryOptions = Partial<{
  limit: number
  offset: number
  order: [string, 'asc' | 'desc']
}>

export type QueryOptions<T> = CommonQueryOptions & Partial<{
  fields: (keyof T)[]
}>
