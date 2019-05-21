----Adding a volunteer log
--admin@witw.com - Rat
--Moly Mole a@witw.com
--Mr Toad b@witw.com
--Mr Badger c@witw.com

----Ratty Rat --------Without Project -
INSERT INTO volunteer_hours_log
  (user_account_id, organisation_id, created_by, volunteer_activity_id, duration, started_at)
VALUES
  ( (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Cafe/Catering'),
    INTERVAL '08:00:00' DAY TO SECOND,
    '2018-09-12T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Cafe/Catering'),
    INTERVAL '08:00:00' DAY TO SECOND,
    '2018-09-13T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Cafe/Catering'),
    INTERVAL '08:00:00' DAY TO SECOND,
    '2018-09-14T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Cafe/Catering'),
    INTERVAL '08:00:00' DAY TO SECOND,
    '2018-09-15T10:00:00.000')
;

----With Project - Mr Toad
INSERT INTO volunteer_hours_log
  (user_account_id, organisation_id, created_by, volunteer_activity_id, volunteer_project_id, duration, started_at)
VALUES
 ( (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='Toad Hall'),
    INTERVAL '01:30:00' DAY TO SECOND,
    '2019-04-25T10:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='River Boat'),
    INTERVAL '01:40:00' DAY TO SECOND,
    '2019-04-25T11:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='Toad Hall'),
    INTERVAL '01:50:00' DAY TO SECOND,
    '2019-04-26T10:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='River Boat'),
    INTERVAL '02:00:00' DAY TO SECOND,
    '2019-04-26T11:00:00.000'),
----BADGER----
 ( (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='Toad Hall'),
    INTERVAL '01:30:00' DAY TO SECOND,
    '2019-04-25T10:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='River Boat'),
    INTERVAL '01:40:00' DAY TO SECOND,
    '2019-04-25T11:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='Toad Hall'),
    INTERVAL '01:50:00' DAY TO SECOND,
    '2019-04-26T10:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='River Boat'),
    INTERVAL '02:00:00' DAY TO SECOND,
    '2019-04-26T11:00:00.000'),
----MOLE----
 ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='Toad Hall'),
    INTERVAL '01:30:00' DAY TO SECOND,
    '2019-04-25T10:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='River Boat'),
    INTERVAL '01:40:00' DAY TO SECOND,
    '2019-04-25T11:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='Toad Hall'),
    INTERVAL '01:50:00' DAY TO SECOND,
    '2019-04-26T10:00:00.000'),
 ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Shop/Sales'),
    (SELECT volunteer_project_id FROM volunteer_project WHERE volunteer_project_name='River Boat'),
    INTERVAL '02:00:00' DAY TO SECOND,
    '2019-04-26T11:00:00.000');


---Without Project - Mole Outdoor
INSERT INTO volunteer_hours_log
  (user_account_id, organisation_id, created_by, volunteer_activity_id, duration, started_at)
VALUES
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:05:00' DAY TO SECOND,
    '2018-02-01T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:10:00' DAY TO SECOND,
    '2018-02-02T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:15:00' DAY TO SECOND,
    '2018-02-03T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:20:00' DAY TO SECOND,
    '2018-02-04T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:25:00' DAY TO SECOND,
    '2018-02-05T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:30:00' DAY TO SECOND,
    '2018-02-06T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:35:00' DAY TO SECOND,
    '2018-02-07T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:40:00' DAY TO SECOND,
    '2018-02-08T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:45:00' DAY TO SECOND,
    '2018-02-09T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:50:00' DAY TO SECOND,
    '2018-02-10T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '00:55:00' DAY TO SECOND,
    '2018-02-11T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:00:00' DAY TO SECOND,
    '2018-02-12T10:00:00.000'),

  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:05:00' DAY TO SECOND,
    '2018-02-13T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:10:00' DAY TO SECOND,
    '2018-02-14T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:15:00' DAY TO SECOND,
    '2018-02-15T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:20:00' DAY TO SECOND,
    '2018-02-16T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:25:00' DAY TO SECOND,
    '2018-02-17T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:30:00' DAY TO SECOND,
    '2018-02-18T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:35:00' DAY TO SECOND,
    '2018-02-19T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:40:00' DAY TO SECOND,
    '2018-02-20T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:45:00' DAY TO SECOND,
    '2018-02-21T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:50:00' DAY TO SECOND,
    '2018-02-22T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '01:55:00' DAY TO SECOND,
    '2018-02-23T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:00:00' DAY TO SECOND,
    '2018-02-24T10:00:00.000'),

  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:05:00' DAY TO SECOND,
    '2018-02-25T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:10:00' DAY TO SECOND,
    '2018-02-26T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:15:00' DAY TO SECOND,
    '2018-02-27T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:20:00' DAY TO SECOND,
    '2018-02-28T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:25:00' DAY TO SECOND,
    '2018-03-01T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:30:00' DAY TO SECOND,
    '2018-03-02T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:35:00' DAY TO SECOND,
    '2018-03-03T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:40:00' DAY TO SECOND,
    '2018-03-04T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:45:00' DAY TO SECOND,
    '2018-03-05T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:50:00' DAY TO SECOND,
    '2018-03-06T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '02:55:00' DAY TO SECOND,
    '2018-03-07T10:00:00.000'),
  ( (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT volunteer_activity_id FROM volunteer_activity WHERE volunteer_activity_name='Outdoor and practical work'),
    INTERVAL '03:00:00' DAY TO SECOND,
    '2018-03-08T10:00:00.000')
;