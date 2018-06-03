-- START TRANSACTION
BEGIN;

/*
 * Extensions
 */
CREATE EXTENSION IF NOT EXISTS postgis;

/*
 * Enumerations
 */
CREATE TYPE genders             AS ENUM ('male', 'female', 'prefer not to say');
CREATE TYPE turnover_bands      AS ENUM ('<100k', '100k-1m', '>1m');
CREATE TYPE permission_type     AS ENUM ('own', 'own_organisation', 'own_beneficiaries');
CREATE TYPE invitation_statuses AS ENUM ('sent', 're-sent', 'accepted', 'revoked');


/*
 * FUNCTIONS
 */
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
  IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
    NEW.modified_at = now();
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$ language 'plpgsql';


/*
 * ORGANISATION RELATED TABLES
 */
CREATE TABLE organisation_region (
  organisation_region_id SERIAL NOT NULL UNIQUE,
  region_name            VARCHAR(80) NOT NULL UNIQUE,

  CONSTRAINT organisation_region_pk PRIMARY KEY (organisation_region_id)
);


CREATE TABLE organisation_sector (
  organisation_sector_id SERIAL NOT NULL UNIQUE,
  sector_name            VARCHAR(80) NOT NULL UNIQUE,

  CONSTRAINT organisation_sector_pk PRIMARY KEY (organisation_sector_id)
);


CREATE TABLE subscription_type (
  subscription_type_id SERIAL NOT NULL UNIQUE,
  type_name            VARCHAR(100) NOT NULL UNIQUE,

  CONSTRAINT subscription_type_pk PRIMARY KEY (subscription_type_id)
);


CREATE TABLE frontline_account (
  frontline_account_id   SERIAL NOT NULL UNIQUE,
  frontline_api_key      VARCHAR(100) NOT NULL,
  frontline_workspace_id VARCHAR(100) NOT NULL,
  nexmo_number           VARCHAR(100) NOT NULL,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT frontline_account_pk PRIMARY KEY (frontline_account_id)
);
CREATE TRIGGER update_frontline_account_modified_at BEFORE UPDATE ON frontline_account
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE funder (
  funder_id   SERIAL NOT NULL UNIQUE,
  funder_name VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at TIMESTAMP WITH TIME ZONE,
  deleted_at  TIMESTAMP WITH TIME ZONE,

  CONSTRAINT funder_pk PRIMARY KEY (funder_id)
);
CREATE TRIGGER update_funder_modified_at BEFORE UPDATE ON funder
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE funding_programme (
  funding_programme_id SERIAL NOT NULL UNIQUE,
  funder_id            BIGINT NOT NULL,
  programme_name       VARCHAR(100) NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at          TIMESTAMP WITH TIME ZONE,
  deleted_at           TIMESTAMP WITH TIME ZONE,

  CONSTRAINT funding_programme_pk           PRIMARY KEY (funding_programme_id),
  CONSTRAINT funding_programme_to_funder_fk FOREIGN KEY (funder_id) REFERENCES funder ON DELETE CASCADE
);
CREATE TRIGGER update_funding_programme_modified_at BEFORE UPDATE ON funding_programme
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE organisation (
  organisation_id        SERIAL NOT NULL UNIQUE,
  organisation_region_id INT NOT NULL,
  organisation_sector_id INT NOT NULL,
  funding_programme_id   INT NOT NULL,
  _360_giving_id         VARCHAR NOT NULL UNIQUE,
  organisation_name      VARCHAR(100) NOT NULL UNIQUE,
  address_1              VARCHAR(100) NOT NULL,
  address_2              VARCHAR(100) NOT NULL,
  town_city              VARCHAR(100) NOT NULL,
  postcode               VARCHAR(10) NOT NULL,
  coordinates            GEOGRAPHY(POINT, 4326),
  logo_url               VARCHAR,
  turnover_band          turnover_bands NOT NULL,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT organisation_pk                        PRIMARY KEY (organisation_id),
  CONSTRAINT organisation_to_organisation_sector_fk FOREIGN KEY (organisation_sector_id) REFERENCES organisation_sector,
  CONSTRAINT organisation_to_organisation_region_fk FOREIGN KEY (organisation_region_id) REFERENCES organisation_region,
  CONSTRAINT organisation_to_funding_programme_fk   FOREIGN KEY (funding_programme_id)   REFERENCES funding_programme
);
CREATE TRIGGER update_organisation_modified_at BEFORE UPDATE ON organisation
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE organisation_subordinate (
  parent_id BIGINT NOT NULL,
  child_id  BIGINT NOT NULL,

  CONSTRAINT organisation_subordinates_to_parent_organisation_fk FOREIGN KEY (parent_id) REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT organisation_subordinates_to_child_organisation_fk  FOREIGN KEY (child_id)  REFERENCES organisation ON DELETE CASCADE
);


CREATE TABLE subscription (
  subscription_id      SERIAL NOT NULL UNIQUE,
  owner_id             BIGINT NOT NULL,
  beneficiary_id       BIGINT NOT NULL,
  frontline_account_id BIGINT NOT NULL,
  subscription_type_id BIGINT NOT NULL,
  expires_at           TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at          TIMESTAMP WITH TIME ZONE,
  deleted_at           TIMESTAMP WITH TIME ZONE,

  CONSTRAINT subscription_pk                             PRIMARY KEY (subscription_id),
  CONSTRAINT subscription_to_owner_organisation_fk       FOREIGN KEY (owner_id)             REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT subscription_to_beneficiary_organisation_fk FOREIGN KEY (beneficiary_id)       REFERENCES organisation,
  CONSTRAINT subscription_to_frontline_account_fk        FOREIGN KEY (frontline_account_id) REFERENCES frontline_account,
  CONSTRAINT subscription_to_subscription_type_fk        FOREIGN KEY (subscription_type_id) REFERENCES subscription_type
);
CREATE TRIGGER update_subscription_modified_at BEFORE UPDATE ON subscription
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE training_session (
  -- stuff
);


/*
 * USER RELATED TABLES
 */
CREATE TABLE user_account (
  user_account_id                  SERIAL NOT NULL UNIQUE,
  user_name                        VARCHAR(100) NOT NULL,
  user_secret                      VARCHAR(64) NOT NULL,
  gender                           genders NOT NULL DEFAULT 'prefer not to say',
  email                            VARCHAR(100),
  phone_number                     VARCHAR(20),
  post_code                        VARCHAR(10),
  birth_year                       INT NOT NULL,
  is_email_contact_consent_granted BOOLEAN NOT NULL DEFAULT false,
  is_sms_contact_consent_granted   BOOLEAN NOT NULL DEFAULT false,
  created_at                       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at                      TIMESTAMP WITH TIME ZONE,
  deleted_at                       TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_account_pk PRIMARY KEY (user_account_id)
);
CREATE TRIGGER update_user_account_modified_at BEFORE UPDATE ON user_account
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE access_role (
  access_role_id   SERIAL NOT NULL UNIQUE,
  access_role_name VARCHAR NOT NULL UNIQUE,

  CONSTRAINT access_role_pk PRIMARY KEY (access_role_id)
);

CREATE TABLE user_account_access_role (
  user_account_id INT NOT NULL,
  access_role_id  INT NOT NULL,
  organisation_id INT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at     TIMESTAMP WITH TIME ZONE,
  deleted_at      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_account_access_role_to_user_fk         FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT user_account_access_role_to_access_role_fk  FOREIGN KEY (access_role_id)  REFERENCES access_role  ON DELETE CASCADE,
  CONSTRAINT user_account_access_role_to_organisation_fk FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE
);
CREATE TRIGGER update_user_account_access_role_modified_at BEFORE UPDATE ON user_account_access_role
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE permission (
  permission_id SERIAL NOT NULL UNIQUE,
  entity        VARCHAR NOT NULL UNIQUE,
  read_access   permission_type NOT NULL,
  write_access  permission_type NOT NULL,
  delete_access permission_type NOT NULL,

  CONSTRAINT permission_pk PRIMARY KEY (permission_id)
);


CREATE TABLE access_role_permission (
  access_role_id INT NOT NULL,
  permission_id  INT NOT NULL,

  CONSTRAINT access_role_permission_to_access_role_fk FOREIGN KEY (access_role_id) REFERENCES access_role ON DELETE CASCADE,
  CONSTRAINT access_role_permission_to_permission_fk  FOREIGN KEY (permission_id)  REFERENCES permission  ON DELETE CASCADE
);


CREATE TABLE user_secret_reset (
  user_secret_reset_id SERIAL NOT NULL UNIQUE,
  user_account_id      INT NOT NULL,
  reset_token          VARCHAR NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at          TIMESTAMP WITH TIME ZONE,
  deleted_at           TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_secret_reset_pk                 PRIMARY KEY (user_secret_reset_id),
  CONSTRAINT user_secret_reset_to_user_account_fk FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE
);
CREATE TRIGGER update_user_secret_reset_modified_at BEFORE UPDATE ON user_secret_reset
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE user_invitation (
  user_invitation_id SERIAL NOT NULL UNIQUE,
  invitation_status  invitation_statuses NOT NULL,
  created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at        TIMESTAMP WITH TIME ZONE,
  deleted_at         TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_invitation_pk PRIMARY KEY (user_invitation_id)
);
CREATE TRIGGER update_user_invitation_modified_at BEFORE UPDATE ON user_invitation
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE login_event (
  login_event_id  SERIAL NOT NULL UNIQUE,
  user_account_id INT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT login_event_pk         PRIMARY KEY (login_event_id),
  CONSTRAINT login_event_to_user_fk FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE
);


/*
 * VISIT RELATED TABLES
 */
CREATE TABLE visit_activity_category (
  visit_activity_category_id SERIAL NOT NULL UNIQUE,
  category_name              VARCHAR NOT NULL,

  CONSTRAINT visit_activity_category_pk PRIMARY KEY (visit_activity_category_id)
);


CREATE TABLE visit_activity (
  visit_activity_id          SERIAL NOT NULL UNIQUE,
  organisation_id            INT NOT NULL,
  visit_activity_category_id INT NOT NULL,
  activity_name              VARCHAR(80) NOT NULL,
  monday                     BOOLEAN NOT NULL DEFAULT false,
  tuesday                    BOOLEAN NOT NULL DEFAULT false,
  wednesday                  BOOLEAN NOT NULL DEFAULT false,
  thursday                   BOOLEAN NOT NULL DEFAULT false,
  friday                     BOOLEAN NOT NULL DEFAULT false,
  saturday                   BOOLEAN NOT NULL DEFAULT false,
  sunday                     BOOLEAN NOT NULL DEFAULT false,
  created_at                 TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at                TIMESTAMP WITH TIME ZONE,
  deleted_at                 TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_activity_pk                            PRIMARY KEY (visit_activity_id),
  CONSTRAINT visit_activity_to_organisation_fk            FOREIGN KEY (organisation_id)            REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT visit_activity_to_visit_activity_category_fk FOREIGN KEY (visit_activity_category_id) REFERENCES visit_activity_category
);
CREATE TRIGGER update_visit_activity_modified_at BEFORE UPDATE ON visit_activity
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE visit (
  visit_id          SERIAL NOT NULL UNIQUE,
  user_account_id   INT NOT NULL,
  visit_activity_id INT NOT NULL,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at       TIMESTAMP WITH TIME ZONE,
  deleted_at        TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_pk                   PRIMARY KEY (visit_id),
  CONSTRAINT visit_to_user_fk           FOREIGN KEY (user_account_id)   REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT visit_to_visit_activity_fk FOREIGN KEY (visit_activity_id) REFERENCES visit_activity
);
CREATE TRIGGER update_visit_modified_at BEFORE UPDATE ON visit
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE visit_feedback (
  visit_feedback_id SERIAL NOT NULL UNIQUE,
  organisation_id   INT NOT NULL,
  score             INT NOT NULL,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at       TIMESTAMP WITH TIME ZONE,
  deleted_at        TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_feedback_pk                 PRIMARY KEY (visit_feedback_id),
  CONSTRAINT visit_feedback_to_organisation_fk FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT visit_activity_valid_score        CHECK (score > -2 AND score < 2)
);
CREATE TRIGGER update_visit_feedback_modified_at BEFORE UPDATE ON visit_feedback
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


/*
 * VOLUNTEER RELATED TABLES
 */
CREATE TABLE volunteer_activity (
  volunteer_activity_id SERIAL NOT NULL UNIQUE,
  activity_name         VARCHAR NOT NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at           TIMESTAMP WITH TIME ZONE,
  deleted_at            TIMESTAMP WITH TIME ZONE,

  CONSTRAINT volunteer_activity_pk PRIMARY KEY (volunteer_activity_id)
);
CREATE TRIGGER update_volunteer_activity_modified_at BEFORE UPDATE ON volunteer_activity
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE volunteer_hours_log (
  volunteer_hours_log_id SERIAL NOT NULL UNIQUE,
  volunteer_activity_id  INT NOT NULL,
  user_account_id        INT NOT NULL,
  organisation_id        INT NOT NULL,
  duration               INTERVAL DAY TO SECOND NOT NULL,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT volunteer_hours_log_pk                       PRIMARY KEY (volunteer_hours_log_id),
  CONSTRAINT volunteer_hours_log_to_volunteer_activity_fk FOREIGN KEY (volunteer_activity_id) REFERENCES volunteer_activity,
  CONSTRAINT volunteer_hours_log_to_user_fk               FOREIGN KEY (user_account_id)       REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT volunteer_hours_log_to_organisation_fk       FOREIGN KEY (organisation_id)       REFERENCES organisation ON DELETE CASCADE
);
CREATE TRIGGER update_volunteer_hours_log_modified_at BEFORE UPDATE ON volunteer_hours_log
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE volunteer_admin_one_time_code (
  volunteer_admin_one_time_code_id SERIAL NOT NULL UNIQUE,
  user_account_id                  INT NOT NULL,
  code                             VARCHAR NOT NULL,
  created_at                       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at                       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + interval '1 day',
  used_at                          TIMESTAMP WITH TIME ZONE,
  deleted_at                       TIMESTAMP WITH TIME ZONE,

  CONSTRAINT volunteer_admin_one_time_code_pk           PRIMARY KEY (volunteer_admin_one_time_code_id),
  CONSTRAINT volunteer_admin_one_time_code_to_user_fk   FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT volunteer_admin_one_time_code_valid_expiry CHECK ( expires_at > created_at )
);

/*
 * OUTREACH TABLES
 */
CREATE TABLE outreach_type (
  outreach_type_id   SERIAL NOT NULL UNIQUE,
  outreach_type_name VARCHAR NOT NULL,

  CONSTRAINT outreach_type_pk PRIMARY KEY (outreach_type_id)
);


CREATE TABLE outreach_meeting_type (
  outreach_meeting_type_id   SERIAL NOT NULL UNIQUE,
  meeting_type_name VARCHAR NOT NULL,

  CONSTRAINT outreach_meeting_type_pk PRIMARY KEY (outreach_meeting_type_id)
);


CREATE TABLE outreach_campaign (
  outreach_campaign_id SERIAL NOT NULL UNIQUE,
  outreach_type_id     INT NOT NULL,
  organisation_id      INT NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at          TIMESTAMP WITH TIME ZONE,
  deleted_at           TIMESTAMP WITH TIME ZONE,

  CONSTRAINT outreach_campaign_pk                  PRIMARY KEY (outreach_campaign_id),
  CONSTRAINT outreach_campaign_to_organisation_fk  FOREIGN KEY (organisation_id)  REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT outreach_campaign_to_outreach_type_fk FOREIGN KEY (outreach_type_id) REFERENCES outreach_type
);
CREATE TRIGGER update_outreach_campaign_modified_at BEFORE UPDATE ON outreach_campaign
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE outreach_meeting (
  outreach_meeting_id      SERIAL NOT NULL UNIQUE,
  user_account_id          INT NOT NULL,
  outreach_campaign_id     INT NOT NULL,
  outreach_meeting_type_id INT NOT NULL,
  outreach_partner         VARCHAR(100) NOT NULL,
  created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_at              TIMESTAMP WITH TIME ZONE,
  deleted_at               TIMESTAMP WITH TIME ZONE,

  CONSTRAINT outreach_meeting_pk                          PRIMARY KEY (outreach_meeting_id),
  CONSTRAINT outreach_meeting_to_user_fk                  FOREIGN KEY (user_account_id)          REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT outreach_meeting_to_outreach_campaign_fk     FOREIGN KEY (outreach_campaign_id)     REFERENCES outreach_campaign,
  CONSTRAINT outreach_meeting_to_outreach_meeting_type_fk FOREIGN KEY (outreach_meeting_type_id) REFERENCES outreach_meeting_type
);
CREATE TRIGGER update_outreach_meeting_modified_at BEFORE UPDATE ON outreach_meeting
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();


CREATE TABLE outreach_campaign_target (
  outreach_campaign_target_id SERIAL NOT NULL UNIQUE,
  target_name                 VARCHAR NOT NULL,

  CONSTRAINT outreach_campaign_target_pk PRIMARY KEY (outreach_campaign_target_id)
);


CREATE TABLE outreach_campaign_valid_target (
  outreach_campaign_target_id INT NOT NULL,
  outreach_type_id            INT NOT NULL,

  CONSTRAINT outreach_campaign_valid_target_to_outreach_campaign_target_fk FOREIGN KEY (outreach_campaign_target_id) REFERENCES outreach_campaign_target ON DELETE CASCADE,
  CONSTRAINT outreach_campaign_valid_target_to_outreach_type_fk            FOREIGN KEY (outreach_type_id)            REFERENCES outreach_type            ON DELETE CASCADE,
  CONSTRAINT outreach_campaign_valid_target_is_not_redundant               UNIQUE (outreach_campaign_target_id, outreach_type_id)
);


-- END TRANSACTION
COMMIT;
