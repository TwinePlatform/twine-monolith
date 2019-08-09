/*
 * Create user session monitoring table
 */

CREATE TABLE user_session_record (
  user_session_record_id SERIAL NOT NULL UNIQUE,
  user_account_id        INT NOT NULL,
  organisation_id        INT NOT NULL,
  session_id             VARCHAR NOT NULL UNIQUE,
  session_end_type       VARCHAR,
  referrers              JSONB NOT NULL,
  started_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at               TIMESTAMP WITH TIME ZONE,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_session_record_pk              PRIMARY KEY (user_session_record_id),
  CONSTRAINT user_session_record_to_user_account FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT user_session_record_to_organisation FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE
);

/*
 * Triggers
 */
CREATE TRIGGER update_user_session_record_modified_at BEFORE UPDATE ON user_session_record
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
