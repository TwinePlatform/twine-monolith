/*
 * Volunteer related tables
 */

CREATE TABLE volunteer_activity (
  volunteer_activity_id SERIAL NOT NULL UNIQUE,
  activity_name         VARCHAR NOT NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at           TIMESTAMP WITH TIME ZONE,
  deleted_at            TIMESTAMP WITH TIME ZONE,

  CONSTRAINT volunteer_activity_pk PRIMARY KEY (volunteer_activity_id)
);


CREATE TABLE volunteer_hours_log (
  volunteer_hours_log_id SERIAL NOT NULL UNIQUE,
  volunteer_activity_id  INT NOT NULL,
  user_account_id        INT NOT NULL,
  community_business_id        INT NOT NULL,
  duration               INTERVAL DAY TO SECOND NOT NULL,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT volunteer_hours_log_pk                       PRIMARY KEY (volunteer_hours_log_id),
  CONSTRAINT volunteer_hours_log_to_volunteer_activity_fk FOREIGN KEY (volunteer_activity_id)   REFERENCES volunteer_activity,
  CONSTRAINT volunteer_hours_log_to_user_fk               FOREIGN KEY (user_account_id)         REFERENCES user_account       ON DELETE CASCADE,
  CONSTRAINT volunteer_hours_log_to_community_business_fk FOREIGN KEY (community_business_id)   REFERENCES community_business ON DELETE CASCADE
);


CREATE TABLE volunteer_admin_one_time_code (
  volunteer_admin_one_time_code_id SERIAL NOT NULL UNIQUE,
  user_account_id                  INT NOT NULL,
  code                             VARCHAR NOT NULL,
  created_at                       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at                       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP + interval '1 day',
  used_at                          TIMESTAMP WITH TIME ZONE,
  deleted_at                       TIMESTAMP WITH TIME ZONE,

  CONSTRAINT volunteer_admin_one_time_code_pk           PRIMARY KEY (volunteer_admin_one_time_code_id),
  CONSTRAINT volunteer_admin_one_time_code_to_user_fk   FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT volunteer_admin_one_time_code_valid_expiry CHECK       (expires_at > created_at)
  CONSTRAINT volunteer_admin_one_time_code_valid_usage  CHECK       (used_at IS NULL OR (used_at < expires_at AND used_at > created_at))
);



/*
 * Triggers
 */
CREATE TRIGGER update_volunteer_activity_modified_at BEFORE UPDATE ON volunteer_activity
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_volunteer_hours_log_modified_at BEFORE UPDATE ON volunteer_hours_log
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
