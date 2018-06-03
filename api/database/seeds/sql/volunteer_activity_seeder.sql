ALTER SEQUENCE volunteer_activity_seq RESTART WITH 1;

INSERT INTO volunteer_activity
  (activity_name)
VALUES
  ("Helping with raising funds (shop, events…)"),
  ("Outdoor and practical work"),
  ("Community outreach and communications"),
  ("Committee work, AGM"),
  ("Office support"),
  ("Support and Care for vulnerable community members"),
  ("Professional pro bono work (Legal, IT, Research)"),
  ("Other");
