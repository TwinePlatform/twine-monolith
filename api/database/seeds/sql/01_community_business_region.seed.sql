TRUNCATE community_business_region RESTART IDENTITY;

INSERT INTO community_business_region
  (region_name)
VALUES
  ("North East"),
  ("North West"),
  ("Midlands"),
  ("Wales"),
  ("South West"),
  ("South East"),
  ("Greater London");
