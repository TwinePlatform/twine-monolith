/*
 * Migration template - add confirm add role token table
 */


CREATE TABLE confirm_add_role (
  confirm_add_role_id SERIAL NOT NULL UNIQUE,
  user_account_id      INT NOT NULL,
  single_use_token_id  INT NOT NULL UNIQUE,

  CONSTRAINT confirm_add_role_pk                      PRIMARY KEY (confirm_add_role_id),
  CONSTRAINT confirm_add_role_to_user_account_fk      FOREIGN KEY (user_account_id)     REFERENCES user_account     ON DELETE CASCADE,
  CONSTRAINT confirm_add_role_to_single_use_token_fk  FOREIGN KEY (single_use_token_id) REFERENCES single_use_token ON DELETE CASCADE
);