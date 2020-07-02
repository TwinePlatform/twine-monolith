/*
 * Create monitoring table for ignoring synced logs
 *
 * See https://github.com/TwinePlatform/twine-monolith/issues/246
 */

CREATE TABLE invalid_synced_logs_monitoring (
  invalid_synced_logs_monitoring_id SERIAL NOT NULL UNIQUE,
  user_account_id                   INT NOT NULL,
  organisation_id                   INT NOT NULL,
  payload                           JSONB NOT NULL,
  created_at                        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                       TIMESTAMP WITH TIME ZONE,
  deleted_at                        TIMESTAMP WITH TIME ZONE,

  CONSTRAINT invalid_synced_logs_monitoring_pk                       PRIMARY KEY (invalid_synced_logs_monitoring_id),
  CONSTRAINT invalid_synced_logs_monitoring_to_user_fk               FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE,
  CONSTRAINT invalid_synced_logs_monitoring_to_community_business_fk FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE
);
