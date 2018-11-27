/*
 * Visitor related tables
 */

CREATE TABLE visit_activity_category (
  visit_activity_category_id   SERIAL NOT NULL UNIQUE,
  visit_activity_category_name VARCHAR(255) NOT NULL,
  created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                  TIMESTAMP WITH TIME ZONE,
  deleted_at                   TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_activity_category_pk PRIMARY KEY (visit_activity_category_id)
);


CREATE TABLE visit_activity (
  visit_activity_id          SERIAL NOT NULL UNIQUE,
  organisation_id            INT NOT NULL,
  visit_activity_category_id INT,
  visit_activity_name        CITEXT NOT NULL,
  monday                     BOOLEAN NOT NULL DEFAULT false,
  tuesday                    BOOLEAN NOT NULL DEFAULT false,
  wednesday                  BOOLEAN NOT NULL DEFAULT false,
  thursday                   BOOLEAN NOT NULL DEFAULT false,
  friday                     BOOLEAN NOT NULL DEFAULT false,
  saturday                   BOOLEAN NOT NULL DEFAULT false,
  sunday                     BOOLEAN NOT NULL DEFAULT false,
  created_at                 TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                TIMESTAMP WITH TIME ZONE,
  deleted_at                 TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_activity_pk                            PRIMARY KEY (visit_activity_id),
  CONSTRAINT visit_activity_to_community_business_fk      FOREIGN KEY (organisation_id)            REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT visit_activity_to_visit_activity_category_fk FOREIGN KEY (visit_activity_category_id) REFERENCES visit_activity_category ON DELETE CASCADE,
  CONSTRAINT visit_activity_visit_activity_name_length    CHECK (char_length(visit_activity_name) <= 255)
);


CREATE TABLE visit_log (
  visit_log_id      SERIAL NOT NULL UNIQUE,
  user_account_id   INT NOT NULL,
  visit_activity_id INT NOT NULL,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP WITH TIME ZONE,
  deleted_at        TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_log_pk                   PRIMARY KEY (visit_log_id),
  CONSTRAINT visit_log_to_user_fk           FOREIGN KEY (user_account_id)   REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT visit_log_to_visit_activity_fk FOREIGN KEY (visit_activity_id) REFERENCES visit_activity ON DELETE CASCADE
);


CREATE TABLE visit_feedback (
  visit_feedback_id     SERIAL NOT NULL UNIQUE,
  organisation_id       INT NOT NULL,
  score                 INT NOT NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at           TIMESTAMP WITH TIME ZONE,
  deleted_at            TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_feedback_pk                       PRIMARY KEY (visit_feedback_id),
  CONSTRAINT visit_feedback_to_community_business_fk FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT visit_activity_valid_score              CHECK       (score > -2 AND score < 2)
);



/*
 * Triggers
 */
CREATE TRIGGER update_visit_activity_modified_at BEFORE UPDATE ON visit_activity
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_visit_modified_at BEFORE UPDATE ON visit_log
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_visit_feedback_modified_at BEFORE UPDATE ON visit_feedback
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_visit_activity_category_modified_at BEFORE UPDATE ON visit_activity_category
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
