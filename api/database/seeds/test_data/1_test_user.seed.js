const { hashSync } = require('bcrypt');
const gladosPassword = hashSync('CakeisaLi3!', 12);
const bigBossPassword = hashSync('Snaaaaaake!', 12);
const chellQrCode = hashSync('chellsqrcode', 12);

exports.seed = (knex) =>
  knex('user_account')
    .insert([
      {
        user_name: 'Chell',
        qr_code: chellQrCode,
        email: '1498@aperturescience.com',
        phone_number: '+1 425-450-4464',
        post_code: '49829',
        birth_year: '1988',
        is_email_confirmed: false,
        is_phone_number_confirmed: false,
        is_email_contact_consent_granted: false,
        is_sms_contact_consent_granted: false ,
        gender_id: knex('gender').select('gender_id').where({ gender_name: 'female' }),
        disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
        ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
      },
      {
        user_name: 'GlaDos',
        user_password: gladosPassword,
        email: '1@aperturescience.com',
        phone_number: '+1 425-450-4464',
        post_code: '49829',
        birth_year: '1900',
        is_email_confirmed: false,
        is_phone_number_confirmed: false,
        is_email_contact_consent_granted: false,
        is_sms_contact_consent_granted: false,
        gender_id: knex('gender').select('gender_id').where({ gender_name: 'female' }),
        disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
        ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
      },
      {
        user_name: 'Gordon',
        user_password: 'tobereplacedwhenauthissetup',
        email: '1998@blackmesaresearch.com',
        phone_number: '+1 555-555-3141',
        post_code: '82394',
        birth_year: 1974,
        is_email_confirmed: false,
        is_phone_number_confirmed: false,
        is_email_contact_consent_granted: false,
        is_sms_contact_consent_granted: false,
        deleted_at: '2018-07-07T15:14:22Z+01',
        gender_id: knex('gender').select('gender_id').where({ gender_name: 'male' }),
        disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
        ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
      },
      {
        user_name: 'Barney',
        user_password: 'tobereplacedwhenauthissetup',
        email: '2305@blackmesaresearch.com',
        phone_number: '+1 555-555-3141',
        post_code: '82394',
        birth_year: 1974,
        is_email_confirmed: false,
        is_phone_number_confirmed: false,
        is_email_contact_consent_granted: false,
        is_sms_contact_consent_granted: false,
        gender_id: knex('gender').select('gender_id').where({ gender_name: 'male' }),
        disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
        ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
      },
      {
        user_name: 'Big Boss',
        user_password: bigBossPassword,
        email: 'info@outerheaven.com',
        is_email_confirmed: true,
        gender_id: knex('gender').select('gender_id').where({ gender_name: 'male' }),
        disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
        ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
      }
    ]);
