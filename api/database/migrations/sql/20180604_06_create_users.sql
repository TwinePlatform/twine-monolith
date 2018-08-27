/*
 * User related tables
 */
CREATE TABLE gender (
  gender_id    SERIAL NOT NULL UNIQUE,
  gender_name  VARCHAR(100) NOT NULL UNIQUE,

  CONSTRAINT gender_pk PRIMARY KEY (gender_id)
);


CREATE TABLE disability (
  disability_id   SERIAL NOT NULL UNIQUE,
  disability_name VARCHAR(100) NOT NULL UNIQUE,

  CONSTRAINT disability_pk PRIMARY KEY (disability_id)
);


CREATE TABLE ethnicity (
  ethnicity_id   SERIAL NOT NULL UNIQUE,
  ethnicity_name VARCHAR(100) NOT NULL UNIQUE,

  CONSTRAINT ethnicity_pk PRIMARY KEY (ethnicity_id)
);


CREATE TABLE user_account (
  user_account_id                  SERIAL NOT NULL UNIQUE,
  user_name                        VARCHAR(100) NOT NULL,
  user_password                    VARCHAR(64),
  qr_code                          VARCHAR UNIQUE,
  gender_id                        INT NOT NULL,
  disability_id                    INT NOT NULL,
  ethnicity_id                     INT NOT NULL,
  email                            VARCHAR(100) UNIQUE,
  phone_number                     VARCHAR(20),
  post_code                        VARCHAR(10),
  birth_year                       INT,
  is_email_confirmed               BOOLEAN NOT NULL DEFAULT false,
  is_phone_number_confirmed        BOOLEAN NOT NULL DEFAULT false,
  is_email_contact_consent_granted BOOLEAN NOT NULL DEFAULT false,
  is_sms_contact_consent_granted   BOOLEAN NOT NULL DEFAULT false,
  created_at                       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                      TIMESTAMP WITH TIME ZONE,
  deleted_at                       TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_account_pk                  PRIMARY KEY (user_account_id),
  CONSTRAINT user_account_to_gender_fk        FOREIGN KEY (gender_id)     REFERENCES gender,
  CONSTRAINT user_account_to_disability_fk    FOREIGN KEY (disability_id) REFERENCES disability,
  CONSTRAINT user_account_to_ethnicity_fk     FOREIGN KEY (ethnicity_id)  REFERENCES ethnicity,
  CONSTRAINT user_account_sensible_birth_year CHECK       (birth_year IS NULL OR (birth_year > 1890 AND birth_year <= date_part('year', CURRENT_DATE)))
);


CREATE TABLE access_role (
  access_role_id   SERIAL NOT NULL UNIQUE,
  access_role_name VARCHAR NOT NULL UNIQUE,

  CONSTRAINT access_role_pk PRIMARY KEY (access_role_id)
);


CREATE TABLE permission (
  permission_id      SERIAL NOT NULL UNIQUE,
  permission_entity  VARCHAR NOT NULL,
  permission_level    ENUM_permission_level NOT NULL,
  access_type        ENUM_access_type NOT NULL,

  CONSTRAINT permission_pk          PRIMARY KEY (permission_id),
  CONSTRAINT permission_unique_row  UNIQUE      (permission_entity, permission_level, access_type)
);


CREATE TABLE user_account_access_role (
  user_account_id INT NOT NULL,
  access_role_id  INT NOT NULL,
  organisation_id INT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at     TIMESTAMP WITH TIME ZONE,
  deleted_at      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_account_access_role_to_user_fk         FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT user_account_access_role_to_access_role_fk  FOREIGN KEY (access_role_id)  REFERENCES access_role  ON DELETE CASCADE,
  CONSTRAINT user_account_access_role_to_organisation_fk FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT user_account_access_role_unique_row         UNIQUE      (user_account_id, access_role_id, organisation_id),
  CONSTRAINT user_account_access_role_one_role_per_user  UNIQUE      (user_account_id, access_role_id),
  CONSTRAINT user_account_access_role_one_org_per_user   UNIQUE      (user_account_id, organisation_id)
);


CREATE TABLE access_role_permission (
  access_role_id INT NOT NULL,
  permission_id  INT NOT NULL,
  access_mode    VARCHAR NOT NULL DEFAULT 'full',

  CONSTRAINT access_role_permission_to_access_role_fk FOREIGN KEY (access_role_id) REFERENCES access_role ON DELETE CASCADE,
  CONSTRAINT access_role_permission_to_permission_fk  FOREIGN KEY (permission_id)  REFERENCES permission  ON DELETE CASCADE,
  CONSTRAINT access_role_permission_unique_row        UNIQUE      (access_role_id, permission_id, access_mode)
);


CREATE TABLE login_event (
  login_event_id  SERIAL NOT NULL UNIQUE,
  user_account_id INT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT login_event_pk         PRIMARY KEY (login_event_id),
  CONSTRAINT login_event_to_user_fk FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE
);


/*
 * Triggers
 */
CREATE TRIGGER update_user_account_modified_at BEFORE UPDATE ON user_account
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_user_account_access_role_modified_at BEFORE UPDATE ON user_account_access_role
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
