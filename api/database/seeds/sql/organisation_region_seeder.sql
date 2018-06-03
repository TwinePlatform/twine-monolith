TRUNCATE organisation_region RESTART IDENTITY;

INSERT INTO organisation_region
  (region_name)
VALUES
  ("North East"),
  ("North West"),
  ("Midlands"),
  ("Wales"),
  ("South West"),
  ("South East"),
  ("Greater London")
;
