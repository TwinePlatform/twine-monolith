ALTER SEQUENCE subscription_type_seq RESTART WITH 1;

INSERT INTO subscription_type
  (type_name)
VALUES
  ("community_business:full"),
  ("community_business:volunteer"),
  ("community_business:visitor"),
  ("sector_organisation:full");

