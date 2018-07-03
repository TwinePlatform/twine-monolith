/*
 * Visitor related tables
 */

CREATE TABLE visit_activity_category (
  visit_activity_category_id   SERIAL NOT NULL UNIQUE,
  visit_activity_category_name VARCHAR(255) NOT NULL,

  CONSTRAINT visit_activity_category_pk PRIMARY KEY (visit_activity_category_id)
);


CREATE TABLE visit_activity (
  visit_activity_id          SERIAL NOT NULL UNIQUE,
  community_business_id      INT NOT NULL,
  visit_activity_category_id INT,
  visit_activity_name        VARCHAR(255) NOT NULL,
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
  CONSTRAINT visit_activity_to_community_business_fk      FOREIGN KEY (community_business_id)      REFERENCES community_business ON DELETE CASCADE,
  CONSTRAINT visit_activity_to_visit_activity_category_fk FOREIGN KEY (visit_activity_category_id) REFERENCES visit_activity_category
);


CREATE TABLE visit (
  visit_id          SERIAL NOT NULL UNIQUE,
  user_account_id   INT NOT NULL,
  visit_activity_id INT NOT NULL,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP WITH TIME ZONE,
  deleted_at        TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_pk                   PRIMARY KEY (visit_id),
  CONSTRAINT visit_to_user_fk           FOREIGN KEY (user_account_id)   REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT visit_to_visit_activity_fk FOREIGN KEY (visit_activity_id) REFERENCES visit_activity
);


CREATE TABLE visit_feedback (
  visit_feedback_id     SERIAL NOT NULL UNIQUE,
  community_business_id INT NOT NULL,
  score                 INT NOT NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at           TIMESTAMP WITH TIME ZONE,
  deleted_at            TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_feedback_pk                       PRIMARY KEY (visit_feedback_id),
  CONSTRAINT visit_feedback_to_community_business_fk FOREIGN KEY (community_business_id) REFERENCES community_business ON DELETE CASCADE,
  CONSTRAINT visit_activity_valid_score              CHECK       (score > -2 AND score < 2)
);



/*
 * Triggers
 */
CREATE TRIGGER update_visit_activity_modified_at BEFORE UPDATE ON visit_activity
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_visit_modified_at BEFORE UPDATE ON visit
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_visit_feedback_modified_at BEFORE UPDATE ON visit_feedback
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
