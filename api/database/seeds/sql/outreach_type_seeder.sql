ALTER SEQUENCE outreach_type_seq RESTART WITH 1;

INSERT INTO outreach_type
  (outreach_type_name)
VALUES
  ("Community Share Issue"),
  ("Crowdfunding (donations)"),
  ("Asset Transfer"),
  ("Community Energy Project"),
  ("Community Housing Project"),
  ("Public Services Commissioning");
