/*
 * API Tokens table
 */

CREATE TABLE api_token (
  api_token_id SERIAL NOT NULL UNIQUE,
  api_token_name      VARCHAR NOT NULL UNIQUE,
  api_token_access    VARCHAR NOT NULL,
  api_token           VARCHAR NOT NULL UNIQUE,
  created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at         TIMESTAMP WITH TIME ZONE,
  deleted_at          TIMESTAMP WITH TIME ZONE,

  CONSTRAINT api_token_pk           PRIMARY KEY (api_token_id)
);
