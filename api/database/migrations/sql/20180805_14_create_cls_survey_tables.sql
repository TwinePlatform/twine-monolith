/*
 * Benchmark survey data tables
 * National and regional benchmarks for survey questions
 */
CREATE TABLE cls_survey_benchmark_data (
  cls_survey_benchmark_data_id SERIAL NOT NULL UNIQUE,
  frontline_survey_question_id INT NOT NULL,
  community_business_region_id INT NOT NULL,
  score                        FLOAT NOT NULL,
  created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                  TIMESTAMP WITH TIME ZONE,
  deleted_at                   TIMESTAMP WITH TIME ZONE,

  CONSTRAINT cls_survey_benchmark_data_pk                           PRIMARY KEY (cls_survey_benchmark_data_id),
  CONSTRAINT cls_survey_benchmark_data_frontline_survey_question_fk FOREIGN KEY (frontline_survey_question_id) REFERENCES frontline_survey_question ON DELETE CASCADE,
  CONSTRAINT cls_survey_benchmark_data_community_business_region_fk FOREIGN KEY (community_business_region_id) REFERENCES community_business_region ON DELETE CASCADE,
  CONSTRAINT cls_benchmark_data_unique_per_region_per_question      UNIQUE (frontline_survey_question_id, community_business_region_id)
);

CREATE TABLE nps_survey_benchmark_data (
  nps_survey_benchmark_data_id SERIAL NOT NULL UNIQUE,
  frontline_survey_question_id INT NOT NULL,
  detractors                   FLOAT NOT NULL,
  passives                     FLOAT NOT NULL,
  promoters                    FLOAT NOT NULL,
  created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                  TIMESTAMP WITH TIME ZONE,
  deleted_at                   TIMESTAMP WITH TIME ZONE,

  CONSTRAINT nps_survey_benchmark_data_pk                           PRIMARY KEY (nps_survey_benchmark_data_id),
  CONSTRAINT nps_survey_benchmark_data_frontline_survey_question_fk FOREIGN KEY (frontline_survey_question_id) REFERENCES frontline_survey_question ON DELETE CASCADE
);


/*
 * Triggers
 */
CREATE TRIGGER update_cls_survey_benchmark_data_modified_at BEFORE UPDATE ON cls_survey_benchmark_data
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_nps_survey_benchmark_data_modified_at BEFORE UPDATE ON nps_survey_benchmark_data
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
