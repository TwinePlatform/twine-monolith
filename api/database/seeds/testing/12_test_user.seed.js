exports.seed = (knex) =>
  knex('user_account')
    .insert([
      { user_name: 'Chell',
      user_password: 'tobereplacedwhenauthissetup',
      qr_code: 'tobereplacedwhenqrgenissetup',
      gender_id: 1,
      email: '1498@aperturescience.com',
      phone_number: '+1 425-450-4464',
      post_code: '49829',
      birth_year: '1988',
      is_email_confirmed: false,
      is_phone_number_confirmed: false,
      is_email_contact_consent_granted: false,
      is_sms_contact_consent_granted: false }
    ]);
