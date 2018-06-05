/*
 * Training related tables
 */

CREATE TABLE training_session (
  training_session_id SERIAL NOT NULL UNIQUE,
  notes               VARCHAR,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at         TIMESTAMP WITH TIME ZONE,
  deleted_at          TIMESTAMP WITH TIME ZONE,

  CONSTRAINT training_session_pk PRIMARY KEY (training_session_id)
);

CREATE TABLE training_session_organisation (
  training_session_id INT NOT NULL,
  organisation_id     INT NOT NULL,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at         TIMESTAMP WITH TIME ZONE,
  deleted_at          TIMESTAMP WITH TIME ZONE,

  CONSTRAINT training_session_organisation_to_training_session_fk FOREIGN KEY (training_session_id) REFERENCES training_session ON DELETE CASCADE,
  CONSTRAINT training_session_organisation_to_organisation_fk     FOREIGN KEY (organisation_id)     REFERENCES organisation     ON DELETE CASCADE,
)
