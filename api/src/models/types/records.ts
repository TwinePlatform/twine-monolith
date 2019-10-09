import { Duration } from "twine-util";

export interface Disability {
  'disability.disability_id': number;
  'disability.disability_name': string;
  'disability.created_at': Date;
  'disability.modified_at': Date | null;
  'disability.deleted_at': Date | null;
}

export interface Ethnicity {
  'ethnicity.ethnicity_id': number;
  'ethnicity.ethnicity_name': string;
  'ethnicity.created_at': Date;
  'ethnicity.modified_at': Date | null;
  'ethnicity.deleted_at': Date | null;
}

export interface Gender {
  'gender.gender_id': number;
  'gender.gender_name': string;
  'gender.created_at': Date;
  'gender.modified_at': Date | null;
  'gender.deleted_at': Date | null;
}

export interface UserAccount {
  'user_account.user_account_id': number;
  'user_account.gender_id': number;
  'user_account.disability_id': number;
  'user_account.ethnicity_id': number;
  'user_account.user_name': string;
  'user_account.user_password': string | null;
  'user_account.qr_code': string | null;
  'user_account.email': string | null;
  'user_account.phone_number': string | null;
  'user_account.post_code': string | null;
  'user_account.birth_year': number | null;
  'user_account.is_email_confirmed': boolean;
  'user_account.is_phone_number_confirmed': boolean;
  'user_account.is_email_contact_consent_granted': boolean;
  'user_account.is_sms_contact_consent_granted': boolean;
  'user_account.is_temp': boolean | null;
  'user_account.created_at': Date;
  'user_account.modified_at': Date | null;
  'user_account.deleted_at': Date | null;
}

export interface Organisation {
  'organisation.organisation_id': number;
  'organisation.organisation_name': string;
  'organisation._360_giving_id': string;
  'organisation.is_temp': boolean | null;
  'organisation.created_at': Date;
  'organisation.modified_at': Date | null;
  'organisation.deleted_at': Date | null;
}

export interface CommunityBusinessRegion {
  'community_business_region.community_business_region_id': number;
  'community_business_region.region_name': string;
  'community_business_region.created_at': Date;
  'community_business_region.modified_at': Date | null;
  'community_business_region.deleted_at': Date | null;
}

export interface CommunityBusinessSector {
  'community_business_sector.community_business_sector_id': number;
  'community_business_sector.sector_name': string;
  'community_business_sector.created_at': Date;
  'community_business_sector.modified_at': Date | null;
  'community_business_sector.deleted_at': Date | null;
}

export interface CommunityBusiness {
  'community_business.community_business_id': number;
  'community_business.organisation_id': number;
  'community_business.community_business_region_id': number;
  'community_business.community_business_sector_id': number;
  'community_business.address_1': string;
  'community_business.address_2': string;
  'community_business.town_city': string;
  'community_business.post_code': string;
  'community_business.coordinates': string;
  'community_business.logo_url': string;
  'community_business.turnover_band': string;
  'community_business.created_at': Date;
  'community_business.modified_at': Date | null;
  'community_business.deleted_at': Date | null;
}

export interface VolunteerAdminCode {
  'volunteer_admin_code.volunteer_admin_code_id': number;
  'volunteer_admin_code.organisation_id': number;
  'volunteer_admin_code.code': string;
  'volunteer_admin_code.created_at': Date;
  'volunteer_admin_code.modified_at': Date | null;
  'volunteer_admin_code.deleted_at': Date | null;
}

export interface VolunteerActivity {
  'volunteer_activity.volunteer_activity_id': number;
  'volunteer_activity.volunteer_activity_name': string;
  'volunteer_activity.created_at': Date;
  'volunteer_activity.modified_at': Date | null;
  'volunteer_activity.deleted_at': Date | null;
}

export interface VolunteerProject {
  'volunteer_project.volunteer_project_id': number;
  'volunteer_project.volunteer_project_name': string;
  'volunteer_project.organisation_id': number;
  'volunteer_project.created_at': Date;
  'volunteer_project.modified_at': Date | null;
  'volunteer_project.deleted_at': Date | null;
}

export interface VolunteerHoursLog {
  'volunteer_hours_log.volunteer_hours_log_id': number;
  'volunteer_hours_log.volunteer_activity_id': number;
  'volunteer_hours_log.volunteer_project_id': number | null;
  'volunteer_hours_log.organisation_id': number;
  'volunteer_hours_log.duration': Duration.Duration;
  'volunteer_hours_log.started_at': Date;
  'volunteer_hours_log.created_by': number;
  'volunteer_hours_log.created_at': Date;
  'volunteer_hours_log.modified_at': Date | null;
  'volunteer_hours_log.deleted_at': Date | null;
}

export interface VisitActivityCategory {
  'visit_activity_category.visit_activity_category_id': number;
  'visit_activity_category.visit_activity_category_name': string;
  'visit_activity_category.created_at': Date;
  'visit_activity_category.modified_at': Date | null;
  'visit_activity_category.deleted_at': Date | null;
}

export interface VisitActivity {
  'visit_activity.visit_activity_id': number;
  'visit_activity.organisation_id': number;
  'visit_activity.visit_activity_category_id': number;
  'visit_activity.visit_activity_name': string;
  'visit_activity.monday': boolean;
  'visit_activity.tuesday': boolean;
  'visit_activity.wednesday': boolean;
  'visit_activity.thursday': boolean;
  'visit_activity.friday': boolean;
  'visit_activity.saturday': boolean;
  'visit_activity.sunday': boolean;
  'visit_activity.created_at': Date;
  'visit_activity.modified_at': Date | null;
  'visit_activity.deleted_at': Date | null;
}

export interface VisitLog {
  'visit_log.visit_log_id': number;
  'visit_log.user_account_id': number;
  'visit_log.visit_activity_id': number;
  'visit_log.created_at': Date;
  'visit_log.modified_at': Date | null;
  'visit_log.deleted_at': Date | null;
}

export interface VisitFeedback {
  'visit_feedback.visit_feedback_id': number;
  'visit_feedback.organisation_id': number;
  'visit_feedback.score': -1 | 0 | 1;
  'visit_feedback.created_at': Date;
  'visit_feedback.modified_at': Date | null;
  'visit_feedback.deleted_at': Date | null;
}

export interface SingleUseToken {
  'single_use_token.single_use_token_id': number;
  'single_use_token.token': string;
  'single_use_token.created_at': Date;
  'single_use_token.expires_at': Date;
  'single_use_token.used_at': Date | null;
  'single_use_token.deleted_at': Date | null;
}

export interface UserSecretResetToken {
  'user_secret_reset.user_secret_reset_id': number;
  'user_secret_reset.single_use_token_id': number;
  'user_secret_reset.user_account_id': number;
}

export interface ConfirmRoleToken {
  'confirm_add_role.confirm_add_role_id': number;
  'confirm_add_role.single_use_token_id': number;
  'confirm_add_role.user_account_id': number;
}

export interface ApiToken {
  'api_token.api_token_id': number;
  'api_token.api_token_name': string;
  'api_token.api_token_access': string;
  'api_token.api_token': string;
  'api_token.created_at': Date;
  'api_token.modified_at': Date | null;
  'api_token.deleted_at': Date | null;
}
