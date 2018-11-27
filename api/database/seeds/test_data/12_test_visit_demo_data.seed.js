const rndInt = (max, min = 0) => Math.round((max - min) * Math.random() + min);
const chooseRandom = (xs) => xs[rndInt(xs.length)] || xs[0];

exports.seed = async (client) => {
  const [{ access_role_id: cb_admin_role_id }] = await client('access_role')
    .select('access_role_id')
    .where({ access_role_name: 'CB_ADMIN' });
  const [{ access_role_id: visitor_role_id }] = await client('access_role')
    .select('access_role_id')
    .where({ access_role_name: 'VISITOR' });

  const [organisation_id] = await client('organisation')
    .insert({
      organisation_name: 'Twine Community Center',
      _360_giving_id: 'GB-COH-LOLOLOL',
    })
    .returning('organisation_id');

  await client('community_business')
    .insert({
      organisation_id,
      community_business_region_id: client('community_business_region')
        .select('community_business_region_id')
        .where({ region_name: 'London' }),
      community_business_sector_id: client('community_business_sector')
        .select('community_business_sector_id')
        .where({ sector_name: 'Energy' }),
    })

  const [cb_admin_user_id] = await client('user_account')
    .insert({
      user_name: 'Sonja',
      email: 'demo@powertochange.org.uk',
      user_password: '$2b$10$v1sL0AXwuS/gx6JIxZa/hONGP06XaRZIAd7sOq66qsCtTIUGzak1y',
      gender_id: 1,
      ethnicity_id: 1,
      disability_id: 1,
    })
    .returning('user_account_id AS cb_admin_user_id');

  await client('user_account_access_role')
    .insert({
      user_account_id: cb_admin_user_id,
      access_role_id: cb_admin_role_id,
      organisation_id,
    });

  const visitors = await client('user_account')
    .insert([
      {
        user_name: 'James Bond',
        birth_year: 1984,
        phone_number: '',
        qr_code: '9fb59d630d2fb12f7478c56c5f1b2fff20e0dd7c9d3a260eee7308a8eb6cd955',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Britney Spears',
        birth_year: 1982,
        phone_number: '',
        qr_code: '9b57815dcc7568e942baed14c61f636034f138e5f43d72f26ec32a9069f9d7df',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 1,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Aldous Huxley',
        birth_year: 1993,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a771cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Yusra Mardini',
        birth_year: 1998,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a772cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 1,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Seldwyn Morgan',
        birth_year: 1938,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a773cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Joel Alexander',
        birth_year: 1981,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a770cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Daniel Mayhew',
        birth_year: 1983,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a774cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Zebiesha Johnson',
        birth_year: 1985,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a775cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 1,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Liza Frazer',
        birth_year: 1988,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a776cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 1,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Tyrone Mullings',
        birth_year: 1990,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a777cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Murray Mullings',
        birth_year: 1992,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a778cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Aaron Fenlator-Victorian',
        birth_year: 1994,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a779cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Jazmine Fenlator-Victorian',
        birth_year: 1996,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a780cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 1,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'Anthony Watson',
        birth_year: 1998,
        phone_number: '',
        qr_code: 'bcec143de6d9e45c28a9a376f1728f8227e36586ad0a781cf1417b282f1d1afa',
        is_email_contact_consent_granted: true,
        is_sms_contact_consent_granted: true,
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
    ])
    .returning('user_account_id');

  await client('user_account_access_role')
    .insert(visitors.map((v) => ({
      user_account_id: v,
      organisation_id,
      access_role_id: visitor_role_id,
    })));

  const visit_activities = await client('visit_activity')
    .insert([
      { organisation_id, visit_activity_category_id: 1, visit_activity_name: 'Yoga', monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      { organisation_id, visit_activity_category_id: 2, visit_activity_name: 'French Lessons', monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      { organisation_id, visit_activity_category_id: 3, visit_activity_name: 'Baking Lessons', monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      { organisation_id, visit_activity_category_id: 2, visit_activity_name: 'Self-Defence Class', monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
      { organisation_id, visit_activity_category_id: 3, visit_activity_name: 'Flamenco Dancing', monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
      { organisation_id, visit_activity_category_id: 1, visit_activity_name: 'Swimming', monday: false, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
    ])
    .returning('visit_activity_id');

  return client('visit_log')
    .insert([
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-15 12:24:56+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-20 13:32:30+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-16 12:01:20+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-17 09:57:01+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-17 20:04:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-19 20:05:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-19 20:06:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-03-19 20:07:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-23 20:08:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:09:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:10:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:13:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:23:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:33:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:43:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 20:53:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-24 21:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:01:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:02:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:04:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:05:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:06:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:07:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:08:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-25 20:09:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:01:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:02:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:04:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:05:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:06:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:07:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:08:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:09:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 20:10:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-26 21:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:01:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:02:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:04:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:05:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:06:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:07:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-27 20:08:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:09:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 21:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 22:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 23:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:03:27+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:03:37+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:03:47+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:03:57+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:03:07+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 21:13:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:13:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2018-01-28 20:23:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2017-04-29 20:33:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2017-04-29 20:43:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2017-04-29 20:53:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2017-04-29 21:03:17+00'},
      {user_account_id: chooseRandom(visitors), visit_activity_id: chooseRandom(visit_activities), created_at: '2017-04-29 22:03:17+00'},
    ])
}
