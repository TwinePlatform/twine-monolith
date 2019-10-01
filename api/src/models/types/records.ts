
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
  'user_account.created_at': Date;
  'user_account.modified_at': Date | null;
  'user_account.deleted_at': Date | null;
  'user_account.is_temp': boolean | null;
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

export interface VisitActivityCategory {
  'visit_activity_category.visit_activity_category_id': number;
  'visit_activity_category.visit_activity_category_name': string;
  'visit_activity_category.created_at': Date;
  'visit_activity_category.modified_at': Date | null;
  'visit_activity_category.deleted_at': Date | null;
}
