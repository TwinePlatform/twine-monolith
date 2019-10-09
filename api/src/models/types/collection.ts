import * as Knex from 'knex';
import { Maybe, Dictionary, ValueOf } from '../../types/internal';
import { ModelQuery, ModelQueryPartial, SimpleModelQuery, WhereQuery, WhereBetweenQuery } from './query';
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
  VisitCategory,
  VisitLog,
  SingleUseToken,
  PasswordResetToken,
  AddRoleToken,
  Model,
} from './model';
import { GenderEnum } from './constants';
import * as R from './records';


/**
 * Base definition
 */
export type ModelValues = null | boolean | string | number | object | Date;

export interface Collection<TModel extends Model, TRecord> {
  _toColumnNames (a: WhereQuery<TModel>): WhereQuery<TRecord>;
  _toColumnNames (a: WhereBetweenQuery<TModel>): WhereBetweenQuery<TRecord>;

  cast (a: Dictionary<ValueOf<TModel>>, tag?: TModel['__tag']): Partial<TModel>;

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
 * Custom record types
 */
export type UserModelRecord =
  Omit<R.UserAccount, 'user_account.gender_id' | 'user_account.disability_id' | 'user_account.ethnicity_id'>
  & Pick<R.Gender, 'gender.gender_name'>
  & Pick<R.Disability, 'disability.disability_name'>
  & Pick<R.Ethnicity, 'ethnicity.ethnicity_name'>;

export type VisitActivityRecord =
  R.VisitActivity
  & Pick<R.VisitActivityCategory, 'visit_activity_category.visit_activity_category_id'>;

/**
 * Type aliases
 */
type VisitorWithVisits = Visitor & { visits: VisitLog[] };

/**
 * User Collections
 * Includes:
 * - User
 * - Visitor
 * - Volunteer
 * - CB Admin
 */

export interface UserCollection<U extends User = User> extends Collection<U, UserModelRecord> {
  isMemberOf (k: Knex, u: U, cb: CommunityBusiness): Promise<boolean>;
}

export interface VolunteerCollection extends UserCollection<Volunteer> {
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Volunteer>): Promise<Volunteer[]>;

  add (k: Knex, u: Partial<Volunteer>, cb: CommunityBusiness, c?: string): Promise<Volunteer>;

  verifyAdminCode (k: Knex, cb: CommunityBusiness, c: string): Promise<boolean>;
}

export interface CbAdminCollection extends UserCollection<CbAdmin> {
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<CbAdmin>): Promise<CbAdmin>;

  add (k: Knex, u: Partial<CbAdmin>, cb: CommunityBusiness): Promise<CbAdmin>;

  addTemporary (k: Knex, u: Partial<CbAdmin>): Promise<CbAdmin>;
}

export interface VisitorCollection extends UserCollection<Visitor> {
  getWithVisits (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Visitor>, activity?: VisitActivity): Promise<VisitorWithVisits[]>;

  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Visitor>): Promise<Visitor[]>;

  add (k: Knex, u: Partial<Visitor>, cb: CommunityBusiness): Promise<Visitor>;

  addAnonymous (k: Knex, u: Partial<Visitor>, cb: CommunityBusiness): Promise<Visitor>;
}

/**
 * Organisation Collections
 */
export interface OrganisationCollection extends Collection<Organisation, R.Organisation> {
  fromUser (k: Knex, u: ModelQuery<User>): Promise<Maybe<Organisation>>;
}

export interface CommunityBusinessCollection extends Collection<CommunityBusiness, R.CommunityBusiness> {
  fromVisitor (k: Knex, u: ModelQuery<Visitor>): Promise<Maybe<CommunityBusiness>>;
  fromVolunteer (k: Knex, u: ModelQuery<Volunteer>): Promise<Maybe<CommunityBusiness>>;
  fromCbAdmin (k: Knex, u: ModelQuery<CbAdmin>): Promise<Maybe<CommunityBusiness>>;
  fromVolunteerProject (k: Knex, p: ModelQuery<VolunteerProject>): Promise<CommunityBusiness>;
  fromVisitActivity (k: Knex, a: ModelQuery<VisitActivity>): Promise<CommunityBusiness>;
}

export type TempCommunityBusinessCollection = Collection<CommunityBusiness, R.CommunityBusiness>;

/**
 * Volunteer Log Collections
 */
type VolunteerLogSyncStats = { ignored: number; synced: number };

export type VolunteerActivityCollection = Collection<VolunteerActivity, R.VolunteerActivity>;

export interface VolunteerProjectCollection extends Collection<VolunteerProject, R.VolunteerProject> {
  fromCommunityBusiness (k: Knex, c: CommunityBusiness): Promise<VolunteerProject[]>;
}

export interface VolunteerLogCollection extends Collection<VolunteerLog, R.VolunteerHoursLog> {
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
type ActivityAggregates = { activity: string; aggregate: number }[];
type TimeAggregates = { date: string; aggregate: number }[];
type ActivityDays = Pick<VisitActivity, 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;

export interface VisitActivityCollection extends Collection<VisitActivity, VisitActivityRecord> {
  add (k: Knex, c: CommunityBusiness, ct: VisitCategory, name: string, days: ActivityDays): Promise<VisitActivity>;
  fromCommunityBusiness (k: Knex, c: CommunityBusiness): Promise<VisitActivity[]>;
  fromCategory (k: Knex, c: CommunityBusiness, ct: VisitCategory): Promise<VisitActivity[]>;
}

export interface VisitLogCollection extends Collection<VisitLog, R.VisitLog> {
  add (k: Knex, act: VisitActivity, user: Visitor): Promise<VisitLog>;
  fromCommunityBusiness (k: Knex, c: CommunityBusiness, q?: ModelQuery<VisitLog>): Promise<VisitLog[]>;
  fromActivity (k: Knex, a: VisitActivity, q?: ModelQuery<VisitLog>): Promise<VisitLog[]>;
  aggregateByAge (k: Knex, c: CommunityBusiness, g?: AgeGroup[]): Promise<AgeAggregates>;
  aggregateByGender (k: Knex, c: CommunityBusiness): Promise<GenderAggregates>;
  aggregateByActivity (k: Knex, c: CommunityBusiness): Promise<ActivityAggregates>;
  aggregateByTime (k: Knex, c: CommunityBusiness, since?: Date, until?: Date): Promise<TimeAggregates>;
}


/**
 * Token Collections
 */
export interface SingleUseTokenCollection extends Collection<SingleUseToken, R.SingleUseToken> {
  use (k: Knex, u: User, t: string): Promise<SingleUseToken>;
}

export interface PasswordResetTokenCollection extends Collection<PasswordResetToken, R.UserSecretResetToken> {
  create (k: Knex, u: User): Promise<PasswordResetToken>;
  use (k: Knex, u: User): Promise<PasswordResetToken>;
}

export interface AddRoleTokenCollection extends Collection<AddRoleToken, R.ConfirmRoleToken> {
  create (k: Knex, u: User): Promise<AddRoleToken>;
  use (k: Knex, u: User): Promise<AddRoleToken>;
}
