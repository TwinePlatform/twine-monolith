import { Duration } from 'twine-util';
import * as _ from '../../../database/types';
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
import { UserAccount } from './records'


/**
 * Users
 */
export interface User extends Readonly<CommonTimestamps> {
  readonly id?: UserAccount['user_account.user_account_id'];
  readonly name: UserAccount['user_account.user_name'];
  readonly email: UserAccount['user_account.email'];
  readonly phoneNumber?: UserAccount['user_account.phone_number'];
  readonly password?: UserAccount['user_account.user_password'];
  readonly qrCode?: UserAccount['user_account.qr_code'];
  readonly gender: GenderEnum;
  readonly disability: DisabilityEnum;
  readonly ethnicity: EthnicityEnum;
  readonly birthYear?: UserAccount['user_account.birth_year'];
  readonly postCode?: UserAccount['user_account.post_code'];
  readonly isEmailConfirmed: UserAccount['user_account.is_email_confirmed'];
  readonly isPhoneNumberConfirmed: UserAccount['user_account.is_phone_number_confirmed'];
  readonly isEmailConsentGranted: UserAccount['user_account.is_email_contact_consent_granted'];
  readonly isSMSConsentGranted: UserAccount['user_account.is_sms_contact_consent_granted'];
  readonly isTemp: UserAccount['user_account.is_temp'];
}
export type Visitor = Require<User, 'qrCode'>;
export type Volunteer = Require<User, 'password' | 'phoneNumber' | 'postCode'>;
export type CbAdmin = Require<User, 'password'>;
export type UserClasses = User | Visitor | Volunteer | CbAdmin;


/**
 * Organisations
 */
export interface Organisation extends Readonly<CommonTimestamps> {
  readonly id: _.organisationFields.organisation_id;
  readonly name: _.organisationFields.organisation_name;
  readonly _360GivingId: _.organisationFields._360_giving_id;
  readonly isTemp?: _.organisationFields.is_temp;
}

export interface CommunityBusiness extends Organisation {
  readonly region: RegionEnum;
  readonly sector: SectorEnum;
  readonly logoUrl?: _.community_businessFields.logo_url;
  readonly address1?: _.community_businessFields.address_1;
  readonly address2?: _.community_businessFields.address_2;
  readonly townCity?: _.community_businessFields.town_city;
  readonly postCode?: _.community_businessFields.post_code;
  readonly coordinates?: Coordinates;
  readonly turnoverBand?: _.community_businessFields.turnover_band;
  readonly adminCode?: _.volunteer_admin_codeFields.code;
}

/**
 * Volunteer Logs
 */
export interface VolunteerActivity extends Readonly<CommonTimestamps> {
  readonly id: _.volunteer_activityFields.volunteer_activity_id;
  readonly name: _.volunteer_activityFields.volunteer_activity_name;
}

export interface VolunteerProject extends Readonly<CommonTimestamps> {
  readonly id: _.volunteer_projectFields.volunteer_project_id;
  readonly name: _.volunteer_projectFields.volunteer_project_name;
  readonly organisation: Organisation;
}

export interface VolunteerLog extends Readonly<CommonTimestamps> {
  readonly id: _.volunteer_hours_logFields.volunteer_hours_log_id;
  readonly user: Volunteer;
  readonly createdBy?: Volunteer | CbAdmin;
  readonly organisation: Organisation;
  readonly activity: VolunteerActivity;
  readonly project?: VolunteerProject;
  readonly duration: Duration.Duration;
  readonly startedAt: Date;
}

/**
 * Visit Logs
 */
export interface VisitCategory extends Readonly<CommonTimestamps> {
  readonly id: _.visit_activity_categoryFields.visit_activity_category_id;
  readonly name: _.visit_activity_categoryFields.visit_activity_category_name;
}

export interface VisitActivity extends Readonly<CommonTimestamps> {
  readonly id: _.visit_activityFields.visit_activity_id;
  readonly name: _.visit_activityFields.visit_activity_name;
  readonly category?: VisitCategory;
  readonly organisation: Organisation;
  readonly monday: _.visit_activityFields.monday;
  readonly tuesday: _.visit_activityFields.tuesday;
  readonly wednesday: _.visit_activityFields.wednesday;
  readonly thursday: _.visit_activityFields.thursday;
  readonly friday: _.visit_activityFields.friday;
  readonly saturday: _.visit_activityFields.saturday;
  readonly sunday: _.visit_activityFields.sunday;
}

export interface VisitLog extends Readonly<CommonTimestamps> {
  readonly id: _.visit_logFields.visit_log_id;
  readonly user: Visitor;
  readonly activty: VisitActivity;
}

/**
 * Tokens
 */
export interface SingleUseToken extends Readonly<CommonTimestamps> {
  readonly id: _.single_use_tokenFields.single_use_token_id;
  readonly token: _.single_use_tokenFields.token;
  readonly expiresAt: _.single_use_tokenFields.expires_at;
  readonly usedAt?: _.single_use_tokenFields.used_at;
}

export interface PasswordResetToken extends SingleUseToken {
  readonly user: User;
}

export interface AddRoleToken extends SingleUseToken {
  readonly user: User;
}

export interface ApiToken extends Readonly<CommonTimestamps> {
  readonly id: _.api_tokenFields.api_token_id;
  readonly name: _.api_tokenFields.api_token_name;
  readonly access: _.api_tokenFields.api_token_access;
  readonly token: _.api_tokenFields.api_token;
}
