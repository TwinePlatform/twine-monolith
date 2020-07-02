/*
 * Add active days table for recording user interaction
 */


CREATE TABLE user_account_active_day (
  user_account_active_day_id  SERIAL NOT NULL UNIQUE,
  user_account_id INT NOT NULL,
  origin          TEXT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT user_account_active_day_pk   PRIMARY KEY (user_account_active_day_id),
  CONSTRAINT active_day_to_user_fk        FOREIGN KEY (user_account_id) REFERENCES user_account ON DELETE CASCADE
);