TRUNCATE outreach_campaign_target RESTART IDENTITY;

INSERT INTO outreach_campaign_target
  (target_name)
VALUES
  ("Community group"),
  ("Resident"),
  ("Investor"),
  ("Local business"),
  ("Local professional forum"),
  ("Local media"),
  ("National media"),
  ("Corporate"),
  ("Larger Corporate"),
  ("Local authority – elected member"),
  ("Local authority – officer – asset management"),
  ("Local authority – officer – other"),
  ("Local authority – officer"),
  ("Energy Provider");
