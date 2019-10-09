import { Duration } from 'twine-util';
import * as R from './records'
import { Require } from '../../types/internal'
import {
  CommonTimestamps,
  GenderEnum,
  DisabilityEnum,
  EthnicityEnum,
  RegionEnum,
  SectorEnum,
  Coordinates,
} from './constants'



interface ModelBase<T> extends Readonly<CommonTimestamps> {
  readonly __model: true;
  readonly __tag: T;
}

/**
 * Users
 */
export interface User<T extends string = 'User' | 'Visitor' | 'Volunteer' | 'CbAdmin'> extends ModelBase<T> {
  readonly id?: R.UserAccount['user_account.user_account_id'];
  readonly name: R.UserAccount['user_account.user_name'];
  readonly email: R.UserAccount['user_account.email'];
  readonly phoneNumber?: R.UserAccount['user_account.phone_number'];
  readonly password?: R.UserAccount['user_account.user_password'];
  readonly qrCode?: R.UserAccount['user_account.qr_code'];
  readonly gender: GenderEnum;
  readonly disability: DisabilityEnum;
  readonly ethnicity: EthnicityEnum;
  readonly birthYear?: R.UserAccount['user_account.birth_year'];
  readonly postCode?: R.UserAccount['user_account.post_code'];
  readonly isEmailConfirmed: R.UserAccount['user_account.is_email_confirmed'];
  readonly isPhoneNumberConfirmed: R.UserAccount['user_account.is_phone_number_confirmed'];
  readonly isEmailConsentGranted: R.UserAccount['user_account.is_email_contact_consent_granted'];
  readonly isSMSConsentGranted: R.UserAccount['user_account.is_sms_contact_consent_granted'];
  readonly isTemp: R.UserAccount['user_account.is_temp'];
}
export type Visitor = Require<User<'Visitor'>, 'qrCode'>;
export type Volunteer = Require<User<'Volunteer'>, 'password' | 'phoneNumber' | 'postCode'>;
export type CbAdmin = Require<User<'CbAdmin'>, 'password'>;
export type UserClasses = Visitor | Volunteer | CbAdmin;

/**
 * Organisations
 */
export interface Organisation<T = 'Organisation'> extends ModelBase<T> {
  readonly id: R.Organisation['organisation.organisation_id'];
  readonly name: R.Organisation['organisation.organisation_name'];
  readonly _360GivingId: R.Organisation['organisation._360_giving_id'];
  readonly isTemp?: R.Organisation['organisation.is_temp'];
}

export interface CommunityBusiness extends Organisation<'CommunityBusiness'> {
  readonly region: RegionEnum;
  readonly sector: SectorEnum;
  readonly logoUrl?: R.CommunityBusiness['community_business.logo_url'];
  readonly address1?: R.CommunityBusiness['community_business.address_1'];
  readonly address2?: R.CommunityBusiness['community_business.address_2'];
  readonly townCity?: R.CommunityBusiness['community_business.town_city'];
  readonly postCode?: R.CommunityBusiness['community_business.post_code'];
  readonly coordinates?: Coordinates;
  readonly turnoverBand?: R.CommunityBusiness['community_business.turnover_band'];
  readonly adminCode?: R.VolunteerAdminCode['volunteer_admin_code.code'];
}

/**
 * Volunteer Logs
 */
export interface VolunteerActivity extends ModelBase<'VolunteerActivity'> {
  readonly id: R.VolunteerActivity['volunteer_activity.volunteer_activity_id'];
  readonly name: R.VolunteerActivity['volunteer_activity.volunteer_activity_name'];
}

export interface VolunteerProject extends ModelBase<'VolunteerProject'> {
  readonly id: R.VolunteerProject['volunteer_project.volunteer_project_id'];
  readonly name: R.VolunteerProject['volunteer_project.volunteer_project_name'];
  readonly organisationId: Organisation['id'];
}

export interface VolunteerLog extends ModelBase<'VolunteerLog'> {
  readonly id: R.VolunteerHoursLog['volunteer_hours_log.volunteer_hours_log_id'];
  readonly userId: Volunteer['id'];
  readonly createdBy?: Volunteer['id'] | CbAdmin['id'];
  readonly organisationId: Organisation['id'];
  readonly activityId: VolunteerActivity['id'];
  readonly projectId?: VolunteerProject['id'];
  readonly duration: Duration.Duration;
  readonly startedAt: Date;
}

/**
 * Visit Logs
 */
export interface VisitCategory extends ModelBase<'VisitCategory'> {
  readonly id: R.VisitActivityCategory['visit_activity_category.visit_activity_category_id'];
  readonly name: R.VisitActivityCategory['visit_activity_category.visit_activity_category_name'];
}

export interface VisitActivity extends ModelBase<'VisitActivity'> {
  readonly id: R.VisitActivity['visit_activity.visit_activity_id'];
  readonly name: R.VisitActivity['visit_activity.visit_activity_name'];
  readonly categoryId?: VisitCategory['id'];
  readonly organisationId: Organisation['id'];
  readonly monday: R.VisitActivity['visit_activity.monday'];
  readonly tuesday: R.VisitActivity['visit_activity.tuesday'];
  readonly wednesday: R.VisitActivity['visit_activity.wednesday'];
  readonly thursday: R.VisitActivity['visit_activity.thursday'];
  readonly friday: R.VisitActivity['visit_activity.friday'];
  readonly saturday: R.VisitActivity['visit_activity.saturday'];
  readonly sunday: R.VisitActivity['visit_activity.sunday'];
}

export interface VisitLog extends ModelBase<'VisitLog'> {
  readonly id: R.VisitLog['visit_log.visit_log_id'];
  readonly userId: Visitor['id'];
  readonly activityId: VisitActivity['id'];
}

/**
 * Tokens
 */
export interface SingleUseToken<T = 'SingleUseToken'> extends ModelBase<T> {
  readonly id: R.SingleUseToken['single_use_token.single_use_token_id'];
  readonly token: R.SingleUseToken['single_use_token.token'];
  readonly expiresAt: R.SingleUseToken['single_use_token.expires_at'];
  readonly usedAt?: R.SingleUseToken['single_use_token.used_at'];
}

export interface PasswordResetToken extends SingleUseToken<'PasswordResetToken'> {
  readonly userId: User['id'];
}

export interface AddRoleToken extends SingleUseToken<'AddRoleToken'> {
  readonly userId: User['id'];
}

export interface ApiToken extends ModelBase<'ApiToken'> {
  readonly id: R.ApiToken['api_token.api_token_id'];
  readonly name: R.ApiToken['api_token.api_token_name'];
  readonly access: R.ApiToken['api_token.api_token_access'];
  readonly token: R.ApiToken['api_token.api_token'];
}


export type Model =
  User
  | Visitor
  | Volunteer
  | CbAdmin
  | Organisation
  | CommunityBusiness
  | VolunteerActivity
  | VolunteerProject
  | VolunteerLog
  | VisitCategory
  | VisitActivity
  | VisitLog
  | SingleUseToken
  | PasswordResetToken
  | AddRoleToken
  | ApiToken
;
