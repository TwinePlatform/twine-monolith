TRUNCATE community_business_sector RESTART IDENTITY;

INSERT INTO community_business_sector
  (sector_name)
VALUES
  ("Art centre or facility"),
  ("Community hub, facility or space"),
  ("Community pub, shop or café"),
  ("Employment, training, business support or education"),
  ("Energy"),
  ("Environment or nature"),
  ("Food catering or production (incl. farming)"),
  ("Health, care or wellbeing"),
  ("Housing"),
  ("Income or financial inclusion"),
  ("Sport & leisure"),
  ("Transport"),
  ("Visitor facilities or tourism"),
  ("Waste reduction, reuse or recycling");
