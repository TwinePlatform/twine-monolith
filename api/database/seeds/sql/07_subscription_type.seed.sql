TRUNCATE subscription_type RESTART IDENTITY;

INSERT INTO subscription_type
  (type_name)
VALUES
  ("community_business:full"),
  ("community_business:volunteer"),
  ("community_business:visitor"),
  ("sector_organisation:full");
