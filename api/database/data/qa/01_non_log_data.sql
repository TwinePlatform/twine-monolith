----INSERT ORGS----
INSERT INTO public.organisation(
organisation_name, _360_giving_id)
VALUES
('Twine Testing Archers', NULL),
('Twine Testing Simpsons', NULL),
('Twine Testing Wind in the Willows', NULL);

----INSERT CB----
INSERT INTO public.community_business(
 organisation_id, community_business_region_id, community_business_sector_id)
VALUES
  (
    (SELECT organisation_id FROM organisation WHERE organisation_name = 'Twine Testing Archers'),
    (SELECT community_business_region_id FROM community_business_region WHERE region_name = 'London'),
    (SELECT community_business_sector_id FROM community_business_sector WHERE sector_name = 'Food catering or production (incl. farming)')
  ),
  (
    (SELECT organisation_id FROM organisation WHERE organisation_name = 'Twine Testing Simpsons'),
    (SELECT community_business_region_id FROM community_business_region WHERE region_name = 'North East'),
    (SELECT community_business_sector_id FROM community_business_sector WHERE sector_name = 'Sport & leisure')
  ),
  (
    (SELECT organisation_id FROM organisation WHERE organisation_name = 'Twine Testing Wind in the Willows'),
    (SELECT community_business_region_id FROM community_business_region WHERE region_name = 'North West'),
    (SELECT community_business_sector_id FROM community_business_sector WHERE sector_name = 'Environment or nature')
  );

----INSERT Projects----
INSERT INTO public.volunteer_project(
 volunteer_project_name, organisation_id)
VALUES
('Brookfield Farm', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers')),
('Bridge Farm', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers')),
('The Bull', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers')),
('Woodbine', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers')),
('Lower Loxley Hall', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers')),
('Simpsons Home', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons')),
('Springfield Elementary', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons')),
('Moes Tavern', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons')),
('Krusty Burger', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons')),
('Kwik-E-Mart', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons')),
('Toad Hall', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows')),
('River Boat', (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'));


----INSERT USER_ACCOUNT----
INSERT INTO user_account
  (user_name, gender_id, disability_id, ethnicity_id, email, phone_number, birth_year)
VALUES
('David Archer', 2,3,1,'avclung@gmail.com',+440000000001,1959),
('Ruth Archer',1,3,1,'a@archers.com',+440000000002,1964),
('Pip Archer',1,3,1,'b@archers.com',+440000000003,1991),
('Johnny Phillips',2,3,1,'c@archers.com',+440000000004,1998),
('Rex Fairbrother',2,3,1,'d@archers.com',+440000000005,1987),
('Emma Grundy',1,3,1,'e@archers.com',+440000000006,1984),
('Elizabeth Pargetter',1,3,1,'f@archers.com',+440000000007,1971),
('Harrison Burns',3,3,1,'g@archers.com',+440000000008,1981),
('Fallon Rogers',3,3,1,'h@archers.com',+440000000009,1977),
('Lynda Snell',1,3,1,'i@archers.com',+440000000010,1959),
('Marge Simpson',1,3,1,'avclung@yahoo.com.au',+440000000011,1982),
('Lisa Simpson',1,3,1,'a@simpsons.com',+440000000012,2011),
('Homer Simpson',2,3,1,'b@simpsons.com',+440000000013,1979),
('Bart Simpson',2,3,1,'c@simpsons.com',+440000000014,2007),
('Moe Szyslyak',2,3,1,'d@simpsons.com',+440000000015,1964),
('Krusty the Clown',3,3,1,'e@simpsons.com',+440000000016,1969),
('Apu Nahasapeemapetilon',3,3,1,'f@simpsons.com',+440000000017,1974),
('Seymour Skinner',2,3,1,'g@simpsons.com',+440000000018,1973),
('Selma Bouvier',3,3,1,'h@simpsons.com',+440000000019,1971),
('Patty Bouvier',3,3,1,'i@simpsons.com',+440000000020,1971),
('Ratty Rat',3,3,1,'admin@witw.com',+440000000021,1979),
('Moly Mole',2,3,1,'a@witw.com',+440000000022,1978),
('Mr Toad',2,3,1,'b@witw.com',+440000000023,1977),
('Mr Badger',1,3,1,'c@witw.com',+440000000024,1976);


----Adding User Access Roles----
INSERT INTO user_account_access_role
(user_account_id, organisation_id, access_role_id)
VALUES
((SELECT user_account_id FROM user_account WHERE email='avclung@gmail.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER_ADMIN')),
((SELECT user_account_id FROM user_account WHERE email='a@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='b@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='c@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='d@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='e@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='f@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='g@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='h@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='i@archers.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Archers'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
--=========================
((SELECT user_account_id FROM user_account WHERE email='avclung@yahoo.com.au'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER_ADMIN')),
((SELECT user_account_id FROM user_account WHERE email='a@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='b@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='c@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='d@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='e@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='f@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='g@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='h@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='i@simpsons.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Simpsons'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
--=========================
((SELECT user_account_id FROM user_account WHERE email='admin@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER_ADMIN')),
((SELECT user_account_id FROM user_account WHERE email='a@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='b@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER')),
((SELECT user_account_id FROM user_account WHERE email='c@witw.com'),
    (SELECT organisation_id FROM organisation WHERE organisation_name='Twine Testing Wind in the Willows'),
    (SELECT access_role_id FROM access_role WHERE access_role_name='VOLUNTEER'));

----Updating the accounts with those who need to be DELETED----
UPDATE public.user_account
SET deleted_at='2018-09-01T10:01:00.000'
WHERE user_name='Lynda Snell';

