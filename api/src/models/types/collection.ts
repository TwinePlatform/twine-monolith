import * as Knex from 'knex';
import { Maybe, Dictionary } from '../../types/internal';
import { ModelQueryValues, ModelQuery, ModelQueryPartial, SimpleModelQuery } from './query';
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
} from './model';
import * as _ from '../../../database/types';
import { GenderEnum } from './constants';


/**
 * Base definition
 */

export interface Collection<TModel, TRecord> {
  _recordToModelMap: Record<keyof TRecord, keyof TModel>;
  _modelToRecordMap: Record<keyof TModel, keyof TRecord>;

  toColumnNames (a: Partial<Record<keyof TModel, ModelQueryValues<TModel>>>): Partial<TRecord>;

  cast (a: Dictionary<any>): Partial<TModel>;

  serialise (a: Partial<TModel>): Promise<TModel>;

  exists (a: Partial<TModel>): Promise<boolean>;

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

interface UserCollection extends Collection<User, _.user_account> {
  isMemberOf (k: Knex, u: User, cb: any): Promise<boolean>;

  add (k: Knex, u: Partial<Visitor>, cb: CommunityBusiness): Promise<Visitor>;
  add (k: Knex, u: Partial<Volunteer>, cb: CommunityBusiness, c?: string): Promise<Volunteer>;
  add (k: Knex, u: Partial<CbAdmin>, cb: CommunityBusiness): Promise<CbAdmin>;

  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Visitor>): Promise<Visitor[]>;
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Volunteer>): Promise<Volunteer[]>;
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness, q?: ModelQuery<CbAdmin>): Promise<CbAdmin>;
};

interface VolunteerCollection extends UserCollection {
  verifyAdminCode (k: Knex, cb: CommunityBusiness, c: string): Promise<boolean>;
}

interface CbAdminCollection extends UserCollection {
  addTemporary (k: Knex, u: Partial<CbAdmin>): Promise<CbAdmin>;
}

interface VisitorCollection extends UserCollection {
  getWithVisits (k: Knex, cb: CommunityBusiness, q?: ModelQuery<Visitor>, activity?: string): Promise<null>

  addAnonymous (k: Knex, u: Partial<Visitor>, cb: CommunityBusiness): Promise<Visitor>;
}

/**
 * Organisation Collections
 */
interface OrganisationCollection extends Collection<Organisation, _.organisation> {
  fromUser (k: Knex, u: ModelQuery<User>): Promise<Maybe<Organisation>>
}

interface CommunityBusinessCollection extends Collection<CommunityBusiness, _.community_business> {
  fromVisitor (k: Knex, u: ModelQuery<Visitor>): Promise<Maybe<CommunityBusiness>>;
  fromVolunteer (k: Knex, u: ModelQuery<Volunteer>): Promise<Maybe<CommunityBusiness>>;
  fromCbAdmin (k: Knex, u: ModelQuery<CbAdmin>): Promise<Maybe<CommunityBusiness>>;
}

interface TempCommunityBusinessCollection extends Collection<CommunityBusiness, _.community_business> {}

/**
 * Volunteer Log Collections
 */
type VolunteerLogSyncStats = { ignored: number, synced: number };

interface VolunteerActivityCollection extends Collection<VolunteerActivity, _.volunteer_activity> {}

interface VolunteerProjectCollection extends Collection<VolunteerProject, _.volunteer_project> {}

interface VolunteerLogCollection extends Collection<VolunteerLog, _.volunteer_hours_log> {
  recordInvalidLog (k: Knex, u: Volunteer, cb: CommunityBusiness, payload: object): Promise<void>;
  fromUser (k: Knex, u: Volunteer, cb?: CommunityBusiness): Promise<VolunteerLog[]>;
  fromCommunityBusiness (k: Knex, cb: CommunityBusiness): Promise<VolunteerLog[]>;
  syncLogs (k: Knex, cb: CommunityBusiness, u: Volunteer | CbAdmin, ls: Partial<VolunteerLog>[]): Promise<VolunteerLogSyncStats>;
}


/**
 * Visitor Log Collections
 */
type AgeGroup = [number, number];
type AgeAggregates = { ageGroup: AgeGroup, aggregate: number }[];
type GenderAggregates = { gender: GenderEnum, aggregate: number }[];
type ActivityAggregates = { activty: string, aggregate: number }[];
type TimeAggregates = { date: Date, aggregate: number }[];

interface VisitActivityCollection extends Collection<VisitActivity, _.visit_activity> {}

interface VisitLogCollection extends Collection<VisitLog, _.visit_log> {
  getWithUsers (k: Knex, c: CommunityBusiness, q?: ModelQuery<VisitLog>): Promise<>
  aggregateByAge (k: Knex, c: CommunityBusiness, g?: AgeGroup[]): Promise<AgeAggregates>;
  aggregateByGender (k: Knex, c: CommunityBusiness): Promise<GenderAggregates>;
  aggregateByActivity (k: Knex, c: CommunityBusiness): Promise<ActivityAggregates>;
  aggregateByTime (k: Knex, c: CommunityBusiness, since?: Date, until?: Date): Promise<TimeAggregates>;
}
