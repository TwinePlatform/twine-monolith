import * as _ from '../../../database/types';
import { Require } from '../../types/internal'
import { CommonTimestamps, GenderEnum, DisabilityEnum, EthnicityEnum, RegionEnum, SectorEnum, Coordinates } from './constants'


export type User = Readonly<CommonTimestamps & {
  id?: _.user_accountFields.user_account_id;
  name: _.user_accountFields.user_name;
  email: _.user_accountFields.email;
  phoneNumber?: _.user_accountFields.phone_number;
  password?: _.user_accountFields.user_password;
  qrCode?: _.user_accountFields.qr_code;
  gender: GenderEnum;
  disability: DisabilityEnum;
  ethnicity: EthnicityEnum;
  birthYear?: _.user_accountFields.birth_year;
  postCode?: _.user_accountFields.post_code;
  isEmailConfirmed: _.user_accountFields.is_email_confirmed;
  isPhoneNumberConfirmed: _.user_accountFields.is_phone_number_confirmed;
  isEmailConsentGranted: _.user_accountFields.is_email_contact_consent_granted;
  isSMSConsentGranted: _.user_accountFields.is_sms_contact_consent_granted;
  isTemp: _.user_accountFields.is_temp;
}>;
export type Visitor = Require<User, 'qrCode'>;
export type Volunteer = Require<User, 'password' | 'phoneNumber' | 'postCode'>;
export type CbAdmin = Require<User, 'password'>;
export type UserClasses = User | Visitor | Volunteer | CbAdmin;

export type Organisation = Readonly<CommonTimestamps & {
  id: _.organisationFields.organisation_id;
  name: _.organisationFields.organisation_name;
  _360GivingId: _.organisationFields._360_giving_id;
  isTemp?: _.organisationFields.is_temp;
}>;

export type CommunityBusiness = Organisation & Readonly<{
  region: RegionEnum;
  sector: SectorEnum;
  logoUrl: _.community_businessFields.logo_url;
  address1: _.community_businessFields.address_1;
  address2: _.community_businessFields.address_2;
  townCity: _.community_businessFields.town_city;
  postCode: _.community_businessFields.post_code;
  coordinates: Coordinates;
  turnoverBand: _.community_businessFields.turnover_band;
  adminCode?: _.volunteer_admin_codeFields.code;
  frontlineWorkspaceId?: _.frontline_accountFields.frontline_workspace_id;
  frontlineApiKey?: _.frontline_accountFields.frontline_api_key;
}>;
