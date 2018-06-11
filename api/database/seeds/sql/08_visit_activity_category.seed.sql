TRUNCATE visit_activity_category RESTART IDENTITY;

INSERT INTO visit_activity_category
  (category_name)
VALUES
  ("Sports"),
  ("Arts, Craft, and Music"),
  ("Physical health and wellbeing"),
  ("Socialising"),
  ("Adult skills building"),
  ("Education support"),
  ("Employment support"),
  ("Business support"),
  ("Care service"),
  ("Mental health support"),
  ("Housing support"),
  ("Work space"),
  ("Food"),
  ("Outdoor work and gardening"),
  ("Local products"),
  ("Environment and conservation work"),
  ("Transport");
