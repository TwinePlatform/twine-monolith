/*
 * Token related tables
 */

CREATE TABLE single_use_token (
  single_use_token_id SERIAL NOT NULL UNIQUE,
  token               VARCHAR NOT NULL UNIQUE,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP + interval '1 day',
  used_at             TIMESTAMP WITH TIME ZONE,
  deleted_at          TIMESTAMP WITH TIME ZONE,

  CONSTRAINT single_use_token_pk           PRIMARY KEY (single_use_token_id),
  CONSTRAINT single_use_token_valid_expiry CHECK       (expires_at > created_at),
  CONSTRAINT single_use_token_valid_usage  CHECK       (used_at IS NULL OR (used_at < expires_at AND used_at > created_at))
);

CREATE TABLE user_secret_reset (
  user_secret_reset_id SERIAL NOT NULL UNIQUE,
  user_account_id      INT NOT NULL,
  single_use_token_id  INT NOT NULL UNIQUE,

  CONSTRAINT user_secret_reset_pk                     PRIMARY KEY (user_secret_reset_id),
  CONSTRAINT user_secret_reset_to_user_account_fk     FOREIGN KEY (user_account_id)     REFERENCES user_account     ON DELETE CASCADE,
  CONSTRAINT user_secret_reset_to_single_use_token_fk FOREIGN KEY (single_use_token_id) REFERENCES single_use_token ON DELETE CASCADE
);
