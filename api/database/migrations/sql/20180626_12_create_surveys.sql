/*
 * Survey data pushed from FrontlineSMS
 */
CREATE TABLE frontline_survey_question (
  frontline_survey_question_id SERIAL NOT NULL UNIQUE,
  activity_key                 VARCHAR NOT NULL UNIQUE,
  frontline_question_uuid      VARCHAR NOT NULL UNIQUE,
  frontline_survey_uuid        VARCHAR NOT NULL,
  frontline_question_sequence  INT NOT NULL,
  question_text                VARCHAR NOT NULL,
  created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                  TIMESTAMP WITH TIME ZONE,
  deleted_at                   TIMESTAMP WITH TIME ZONE,

  CONSTRAINT frontline_survey_question_pk PRIMARY KEY (frontline_survey_question_id)
);

CREATE TABLE frontline_survey_answer (
  frontline_survey_answer_id   SERIAL NOT NULL UNIQUE,
  frontline_survey_question_id INT NOT NULL,
  organisation_id              INT NOT NULL,
  answer_text                  VARCHAR(255) NOT NULL,
  created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                  TIMESTAMP WITH TIME ZONE,
  deleted_at                   TIMESTAMP WITH TIME ZONE,

  CONSTRAINT frontline_survey_answer_pk                              PRIMARY KEY (frontline_survey_answer_id),
  CONSTRAINT frontline_survey_answer_to_frontline_survey_question_fk FOREIGN KEY (frontline_survey_question_id) REFERENCES frontline_survey_question ON DELETE CASCADE,
  CONSTRAINT frontline_survey_answer_to_community_business_fk        FOREIGN KEY (organisation_id)              REFERENCES organisation ON DELETE CASCADE
);


/*
 * Triggers
 */
CREATE TRIGGER update_frontline_survey_question_modified_at BEFORE UPDATE ON frontline_survey_question
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_frontline_survey_answer_modified_at BEFORE UPDATE ON frontline_survey_answer
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
