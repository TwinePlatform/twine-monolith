----Adding a volunteer log----
----remaining archers----
INSERT INTO volunteer_hours_log
  (user_account_id, organisation_id, created_by, volunteer_activity_id, duration, started_at)
VALUES
  ( (SELECT user_account_id FROM user_account WHERE email='d@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT user_account_id FROM user_account WHERE email='avclung@gmail.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Other'),
    INTERVAL '04:25:00' DAY TO SECOND,
    '2018-07-31T10:00:00.000'),
( (SELECT user_account_id FROM user_account WHERE email='e@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT user_account_id FROM user_account WHERE email='avclung@gmail.com'),
   (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Other'),
    INTERVAL '06:55:00' DAY TO SECOND,
    '2018-08-31T10:00:00.000');

INSERT INTO volunteer_hours_log
  (user_account_id, organisation_id, created_by, volunteer_activity_id, volunteer_project_id, duration, started_at)
VALUES
( (SELECT user_account_id FROM user_account WHERE email='g@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT user_account_id FROM user_account WHERE email='avclung@gmail.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Committee work, AGM'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='The Bull'),
    INTERVAL '02:40:00' DAY TO SECOND,
    '2019-01-01T10:00:00.000'),
( (SELECT user_account_id FROM user_account WHERE email='h@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT user_account_id FROM user_account WHERE email='avclung@gmail.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Committee work, AGM'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='The Bull'),
    INTERVAL '21:00:00' DAY TO SECOND,
    '2019-03-05T10:00:00.000');
