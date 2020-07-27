/*
 * Data sync table
 * - keep record of data synced from old dbs
 */

 CREATE TABLE data_sync_log (
  data_sync_log_id  SERIAL NOT NULL UNIQUE,
  foreign_key       INT NOT NULL,
  table_name        VARCHAR(30) NOT NULL,
  synced_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT data_sync_log_pk  PRIMARY KEY (data_sync_log_id)
);