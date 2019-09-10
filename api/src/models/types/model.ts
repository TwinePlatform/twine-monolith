import * as _ from '../../../database/types';
import { Require, Dictionary } from '../../types/internal'
import { CommonTimestamps, GenderEnum, DisabilityEnum, EthnicityEnum, RegionEnum, SectorEnum, Coordinates } from './constants'
import { Duration } from 'twine-util';

export type HasOne<T, U> = T & { has: U };
export type HasMany<T, U> = T & { has: Dictionary<U> };
export type BelongsTo<T, U> = T & { belongs: U };


/**
 * Users
 */
export interface User extends Readonly<CommonTimestamps> {
  readonly id?: _.user_accountFields.user_account_id;
  readonly name: _.user_accountFields.user_name;
  readonly email: _.user_accountFields.email;
  readonly phoneNumber?: _.user_accountFields.phone_number;
  readonly password?: _.user_accountFields.user_password;
  readonly qrCode?: _.user_accountFields.qr_code;
  readonly gender: GenderEnum;
  readonly disability: DisabilityEnum;
  readonly ethnicity: EthnicityEnum;
  readonly birthYear?: _.user_accountFields.birth_year;
  readonly postCode?: _.user_accountFields.post_code;
  readonly isEmailConfirmed: _.user_accountFields.is_email_confirmed;
  readonly isPhoneNumberConfirmed: _.user_accountFields.is_phone_number_confirmed;
  readonly isEmailConsentGranted: _.user_accountFields.is_email_contact_consent_granted;
  readonly isSMSConsentGranted: _.user_accountFields.is_sms_contact_consent_granted;
  readonly isTemp: _.user_accountFields.is_temp;
};
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
};

export interface CommunityBusiness extends Organisation {
  readonly region: RegionEnum;
  readonly sector: SectorEnum;
  readonly logoUrl: _.community_businessFields.logo_url;
  readonly address1: _.community_businessFields.address_1;
  readonly address2: _.community_businessFields.address_2;
  readonly townCity: _.community_businessFields.town_city;
  readonly postCode: _.community_businessFields.post_code;
  readonly coordinates: Coordinates;
  readonly turnoverBand: _.community_businessFields.turnover_band;
  readonly adminCode?: _.volunteer_admin_codeFields.code;
  readonly frontlineWorkspaceId?: _.frontline_accountFields.frontline_workspace_id;
  readonly frontlineApiKey?: _.frontline_accountFields.frontline_api_key;
};

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
  readonly organisationId: _.volunteer_projectFields.organisation_id;
}

export interface VolunteerLog extends Readonly<CommonTimestamps> {
  readonly id: _.volunteer_hours_logFields.volunteer_hours_log_id;
  readonly userId: _.volunteer_hours_logFields.user_account_id;
  readonly createdBy?: _.volunteer_hours_logFields.created_by;
  readonly userName?: User['name'];
  readonly organisationId: _.volunteer_hours_logFields.organisation_id;
  readonly organisationName?: Organisation['name'];
  readonly activity: VolunteerActivity['name'];
  readonly project?: VolunteerProject['name'];
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
  readonly categoryName?: VisitCategory['name'];
  readonly categoryId?: VisitCategory['id'];
  readonly organisationId: Organisation['id'];
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
  readonly userId: _.visit_logFields.user_account_id;
  readonly activityId: VisitActivity['id'];
  readonly activityName: VisitActivity['name'];
}
