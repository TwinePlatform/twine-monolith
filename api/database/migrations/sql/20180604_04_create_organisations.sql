/*
 * Organisation related tables
 */

CREATE TABLE organisation (
  organisation_id    SERIAL NOT NULL UNIQUE,
  organisation_name  VARCHAR(255) NOT NULL,
  _360_giving_id     VARCHAR UNIQUE,
  created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at        TIMESTAMP WITH TIME ZONE,
  deleted_at         TIMESTAMP WITH TIME ZONE,

  CONSTRAINT organisation_pk PRIMARY KEY (organisation_id)
);


CREATE TABLE funding_body (
  funding_body_id SERIAL NOT NULL UNIQUE,
  organisation_id INT NOT NULL UNIQUE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at     TIMESTAMP WITH TIME ZONE,
  deleted_at      TIMESTAMP WITH TIME ZONE,

  CONSTRAINT funding_body_pk                 PRIMARY KEY (funding_body_id),
  CONSTRAINT funding_body_to_organisation_fk FOREIGN KEY (organisation_id) REFERENCES organisation ON DELETE CASCADE
);


CREATE TABLE funding_programme (
  funding_programme_id   SERIAL NOT NULL UNIQUE,
  funding_body_id        INT NOT NULL,
  funding_programme_name VARCHAR(255) NOT NULL,
  created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at            TIMESTAMP WITH TIME ZONE,
  deleted_at             TIMESTAMP WITH TIME ZONE,

  CONSTRAINT funding_programme_pk                 PRIMARY KEY (funding_programme_id),
  CONSTRAINT funding_programme_to_funding_body_fk FOREIGN KEY (funding_body_id) REFERENCES funding_body ON DELETE CASCADE
);


CREATE TABLE funding_programme_community_business (
  funding_programme_id  INT NOT NULL,
  community_business_id INT NOT NULL,
  membership_status     VARCHAR NOT NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at           TIMESTAMP WITH TIME ZONE,
  deleted_at            TIMESTAMP WITH TIME ZONE,

  CONSTRAINT funding_programme_community_business_to_funding_programme_fk  FOREIGN KEY (funding_programme_id)  REFERENCES funding_programme ON DELETE CASCADE,
  CONSTRAINT funding_programme_community_business_to_community_business_fk FOREIGN KEY (community_business_id) REFERENCES community_business ON DELETE CASCADE,

)


CREATE TABLE community_business_region (
  community_business_region_id SERIAL NOT NULL UNIQUE,
  region_name                  VARCHAR(80) NOT NULL UNIQUE,

  CONSTRAINT community_business_region_pk PRIMARY KEY (community_business_region_id)
);


CREATE TABLE community_business_sector (
  community_business_sector_id SERIAL NOT NULL UNIQUE,
  sector_name                  VARCHAR(80) NOT NULL UNIQUE,

  CONSTRAINT community_business_sector_pk PRIMARY KEY (community_business_sector_id)
);


CREATE TABLE community_business (
  community_business_id        SERIAL NOT NULL UNIQUE,
  organisation_id              INT NOT NULL UNIQUE,
  community_business_region_id INT,
  community_business_sector_id INT,
  address_1                    VARCHAR(255),
  address_2                    VARCHAR(255),
  town_city                    VARCHAR(255),
  post_code                    VARCHAR(10),
  coordinates                  GEOGRAPHY(POINT, 4326),
  logo_url                     VARCHAR,
  turnover_band                ENUM_turnover_band,
  created_at                   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at                  TIMESTAMP WITH TIME ZONE,
  deleted_at                   TIMESTAMP WITH TIME ZONE,

  CONSTRAINT community_business_pk                              PRIMARY KEY (community_business_id),
  CONSTRAINT community_business_to_organisation_fk              FOREIGN KEY (organisation_id)              REFERENCES organisation ON DELETE CASCADE,
  CONSTRAINT community_business_to_community_business_sector_fk FOREIGN KEY (community_business_sector_id) REFERENCES community_business_sector,
  CONSTRAINT community_business_to_community_business_region_fk FOREIGN KEY (community_business_region_id) REFERENCES community_business_region
);


/*
 * Triggers
 */
CREATE TRIGGER update_organisation_modified_at BEFORE UPDATE ON organisation
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_funding_programme_modified_at BEFORE UPDATE ON funding_programme
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_funding_body_modified_at BEFORE UPDATE ON funding_body
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();

CREATE TRIGGER update_community_business_modified_at BEFORE UPDATE ON community_business
  FOR EACH ROW EXECUTE PROCEDURE update_modified_at_column();
