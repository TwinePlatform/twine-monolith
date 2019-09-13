import * as Knex from 'knex';
import { Maybe, Dictionary, ValueOf, Json, EnhancedJson } from '../../types/internal';
import { ModelQueryValues, ModelQuery, ModelQueryPartial, SimpleModelQuery, WhereQuery, WhereBetweenQuery } from './query';
import {
  User,
  Visitor,
  CommunityBusiness,
  Volunteer,
  CbAdmin,
  Organisation,
  VolunteerActivity,
  VolunteerProject,
  VolunteerLog,
  VisitActivity,
  VisitLog,
  SingleUseToken,
  PasswordResetToken,
  AddRoleToken,
} from './model';
import { GenderEnum } from './constants';
import { UserAccount, Gender, Disability, Ethnicity } from './records';
import * as _ from '../../../database/types';


/**
 * Base definition
 */
export type ModelValues = null | boolean | string | number | object | Date;

export interface Collection<TModel, TRecord> {
  _recordToModelMap: Record<keyof TRecord, keyof TModel>;
  _modelToRecordMap: Record<keyof TModel, keyof TRecord>;

  _toColumnNames (a: WhereQuery<TModel>): WhereQuery<TRecord>;
  _toColumnNames (a: WhereBetweenQuery<TModel>): WhereBetweenQuery<TRecord>;

  cast (a: Dictionary<ValueOf<TModel>>): Partial<TModel>;

  serialise (a: Partial<TModel>): Promise<EnhancedJson>;

  exists (k: Knex, a: Partial<TModel>): Promise<boolean>;

  get (k: Knex, q?: ModelQuery<TModel>): Promise<TModel[]>;
  get (k: Knex, q?: ModelQueryPartial<TModel>): Promise<Partial<TModel>[]>;

  getOne (k: Knex, q?: ModelQuery<TModel>): Promise<Maybe<TModel>>;
  getOne (k: Knex, q?: ModelQueryPartial<TModel>): Promise<Maybe<Partial<TModel>>>;

  create (k: Knex, c: Partial<TModel>): Promise<TModel>;

  update (k: Knex, t: SimpleModelQuery<TModel>, c: Partial<TModel>): Promise<TModel[]>;

  delete (k: Knex, t: SimpleModelQuery<TModel>): Promise<TModel[]>;

  destroy (k: Knex, t: SimpleModelQuery<TModel>): Promise<TModel[]>;
}

/**
 * User Collections
 * Includes:
 * - User
 * - Visitor
 * - Volunteer
 * - CB Admin
 */

export type UserModelRecord =
  Omit<UserAccount, 'user_account.gender_id' | 'user_account.disability_id' | 'user_account.ethnicity_id'>
  & Pick<Gender, 'gender.gender_name'>
  & Pick<Disability, 'disability.disability_name'>
  & Pick<Ethnicity, 'ethnicity.ethnicity_name'>;

export interface UserCollection extends Collection<User, UserModelRecord> {
  isMemberOf (k: Knex, u: User, cb: CommunityBusiness): Promise<boolean>;

  add (k: Knex, u: Partial<Visitor>, cb: CommunityBusiness): Promise<Visitor>;
  add (k: Knex, u: Partial<Volunteer>, cb: CommunityBusiness, c?: string): Promise<Volunteer>;
  add (k: Knex, u: Partial<CbAdmin>, cb: CommunityBusiness): Promise<CbAdmin>;

  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Visitor>): Promise<Visitor[]>;
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Volunteer>): Promise<Volunteer[]>;
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<CbAdmin>): Promise<CbAdmin>;
}

export interface VolunteerCollection extends UserCollection {
  verifyAdminCode (k: Knex, cb: CommunityBusiness, c: string): Promise<boolean>;
}

export interface CbAdminCollection extends UserCollection {
  addTemporary (k: Knex, u: Partial<CbAdmin>): Promise<CbAdmin>;
}

export interface VisitorCollection extends UserCollection {
  getWithVisits (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Visitor>, activity?: string): Promise<null>;

  addAnonymous (k: Knex, u: Partial<Visitor>, cb: CommunityBusiness): Promise<Visitor>;
}

/**
 * Organisation Collections
 */
export interface OrganisationCollection extends Collection<Organisation, _.organisation> {
  fromUser (k: Knex, u: ModelQuery<User>): Promise<Maybe<Organisation>>;
}

export interface CommunityBusinessCollection extends Collection<CommunityBusiness, _.community_business> {
  fromVisitor (k: Knex, u: ModelQuery<Visitor>): Promise<Maybe<CommunityBusiness>>;
  fromVolunteer (k: Knex, u: ModelQuery<Volunteer>): Promise<Maybe<CommunityBusiness>>;
  fromCbAdmin (k: Knex, u: ModelQuery<CbAdmin>): Promise<Maybe<CommunityBusiness>>;
}

export type TempCommunityBusinessCollection = Collection<CommunityBusiness, _.community_business>;

/**
 * Volunteer Log Collections
 */
type VolunteerLogSyncStats = { ignored: number; synced: number };

export type VolunteerActivityCollection = Collection<VolunteerActivity, _.volunteer_activity>;

export type VolunteerProjectCollection = Collection<VolunteerProject, _.volunteer_project>;

export interface VolunteerLogCollection extends Collection<VolunteerLog, _.volunteer_hours_log> {
  recordInvalidLog (k: Knex, u: Volunteer, cb: CommunityBusiness, payload: object): Promise<void>;
  fromUser (k: Knex, u: Volunteer, cb?: CommunityBusiness): Promise<VolunteerLog[]>;
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness): Promise<VolunteerLog[]>;
  syncLogs (k: Knex, cb: CommunityBusiness, u: Volunteer | CbAdmin, ls: Partial<VolunteerLog>[]): Promise<VolunteerLogSyncStats>;
}


/**
 * Visitor Log Collections
 */
type AgeGroup = [number, number];
type AgeAggregates = { ageGroup: AgeGroup; aggregate: number }[];
type GenderAggregates = { gender: GenderEnum; aggregate: number }[];
type ActivityAggregates = { activty: string; aggregate: number }[];
type TimeAggregates = { date: Date; aggregate: number }[];

export type VisitActivityCollection = Collection<VisitActivity, _.visit_activity>;

export interface VisitLogCollection extends Collection<VisitLog, _.visit_log> {
  getWithUsers (k: Knex, c: CommunityBusiness, q?: ModelQuery<VisitLog>): Promise<VisitLog>;
  aggregateByAge (k: Knex, c: CommunityBusiness, g?: AgeGroup[]): Promise<AgeAggregates>;
  aggregateByGender (k: Knex, c: CommunityBusiness): Promise<GenderAggregates>;
  aggregateByActivity (k: Knex, c: CommunityBusiness): Promise<ActivityAggregates>;
  aggregateByTime (k: Knex, c: CommunityBusiness, since?: Date, until?: Date): Promise<TimeAggregates>;
}


/**
 * Token Collections
 */
export interface SingleUseTokenCollection extends Collection<SingleUseToken, _.single_use_token> {
  use (k: Knex, u: User, t: string): Promise<SingleUseToken>;
}

export interface PasswordResetTokenCollection extends Collection<PasswordResetToken, _.user_secret_reset> {
  create (k: Knex, u: User): Promise<PasswordResetToken>;
  use (k: Knex, u: User): Promise<PasswordResetToken>;
}

export interface AddRoleTokenCollection extends Collection<AddRoleToken, _.confirm_add_role> {
  create (k: Knex, u: User): Promise<AddRoleToken>;
  use (k: Knex, u: User): Promise<AddRoleToken>;
}
