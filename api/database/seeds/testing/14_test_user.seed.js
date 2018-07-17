exports.seed = (knex) =>
  knex('user_account')
    .insert([
      {
        user_name: 'Chell',
        user_password: 'tobereplacedwhenauthissetup',
        qr_code: 'tobereplacedwhenqrgenissetup',
        email: '1498@aperturescience.com',
        phone_number: '+1 425-450-4464',
        post_code: '49829',
        birth_year: 1988,
        is_email_confirmed: false,
        is_phone_number_confirmed: false,
        is_email_contact_consent_granted: false,
        is_sms_contact_consent_granted: false,
        gender_id: knex('gender').select('gender_id').where({ gender_name: 'female' }),
        disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
        ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
      }
    ]);
