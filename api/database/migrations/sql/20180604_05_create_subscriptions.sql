/*
 * Subscription related tables
 */

CREATE TABLE subscription_type (
  subscription_type_id   SERIAL NOT NULL UNIQUE,
  subscription_type_name VARCHAR NOT NULL UNIQUE,

  CONSTRAINT subscription_type_pk PRIMARY KEY (subscription_type_id)
);


CREATE TABLE frontline_account (
  frontline_account_id   SERIAL NOT NULL UNIQUE,
  frontline_api_key      VARCHAR(100) NOT NULL,
  frontline_workspace_id VARCHAR(100) NOT NULL,
  nexmo_number           VARCHAR(100),
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT frontline_account_pk PRIMARY KEY (frontline_account_id)
);


CREATE TABLE subscription (
  subscription_id      SERIAL NOT NULL UNIQUE,
  owner_id             INT NOT NULL,
  beneficiary_id       INT DEFAULT NULL,
  frontline_account_id INT NOT NULL,
  subscription_type_id INT NOT NULL,
  subscription_status  ENUM_subscription_status NOT NULL,
  expires_at           TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at          TIMESTAMP WITH TIME ZONE,
  deleted_at           TIMESTAMP WITH TIME ZONE,

  CONSTRAINT subscription_pk                      PRIMARY KEY (subscription_id),
  CONSTRAINT subscription_to_owner_fk             FOREIGN KEY (owner_id)             REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT subscription_to_beneficiary_fk       FOREIGN KEY (beneficiary_id)       REFERENCES organisation,
  CONSTRAINT subscription_to_frontline_account_fk FOREIGN KEY (frontline_account_id) REFERENCES frontline_account,
  CONSTRAINT subscription_to_subscription_type_fk FOREIGN KEY (subscription_type_id) REFERENCES subscription_type,
  CONSTRAINT subscription_valid_expiry            CHECK       (expires_at > created_at)
);


/*
 * Triggers
 */
CREATE TRIGGER update_frontline_account_modified_at BEFORE UPDATE ON frontline_account
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_subscription_modified_at BEFORE UPDATE ON subscription
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
