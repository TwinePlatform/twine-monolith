const { hashSync } = require('bcrypt');
const gladosPassword = hashSync('CakeisaLi3!', 12);
const gordonPassword = hashSync('i<3Hawkin', 12)
const bigBossPassword = hashSync('Snaa4aaake!', 12);
const emmaPassword = hashSync('Hal0ops!', 12);

exports.seed = async (knex) => {
  /*
   * Chell - VISITOR
   */
  await knex('user_account')
    .insert({
      user_name: 'Chell',
      qr_code: 'chellsqrcode',
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
    });

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Chell' }),
      organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Aperture Science' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VISITOR' }),
    })

  /*
   * GlaDos - CB_ADMIN
   */
  await knex('user_account')
    .insert({
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
    })

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'GlaDos' }),
      organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Aperture Science' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'CB_ADMIN' }),
    });

  /*
   * Gordon - CB_ADMIN
   */
  await knex('user_account')
    .insert({
      user_name: 'Gordon',
      user_password: gordonPassword,
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
    });

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Gordon' }),
      organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Black Mesa Research' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'CB_ADMIN' }),
    });

  /*
   * Barney - No Role (Do not change)
   */
  await knex('user_account')
    .insert({
      user_name: 'Barney',
      user_password: gordonPassword,
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
    });

  /*
   * Big Boss - TWINE_ADMIN
   */
  await knex('user_account')
    .insert({
      user_name: 'Big Boss',
      user_password: bigBossPassword,
      email: 'info@outerheaven.com',
      is_email_confirmed: true,
      gender_id: knex('gender').select('gender_id').where({ gender_name: 'male' }),
      disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
      ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
    });

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Big Boss' }),
      organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Aperture Science' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'TWINE_ADMIN' }),
    });

  /*
   * Emma Emmerich - VOLUNTEER
   */
  await knex('user_account')
    .insert({
      user_name: 'Emma Emmerich',
      user_password: emmaPassword,
      email: 'emma@sol.com',
      phone_number: '+1 555-555-3141',
      post_code: '82394',
      birth_year: 1996,
      is_email_confirmed: true,
      is_phone_number_confirmed: false,
      is_email_contact_consent_granted: false,
      is_sms_contact_consent_granted: false,
      gender_id: knex('gender').select('gender_id').where({ gender_name: 'female' }),
      disability_id: knex('disability').select('disability_id').where({ disability_name: 'yes' }),
      ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
    });

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Emma Emmerich' }),
      organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Black Mesa Research' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VOLUNTEER' }),
    });

  /*
   * Raiden - VOLUNTEER_ADMIN
   */
  await knex('user_account')
    .insert({
      user_name: 'Raiden',
      user_password: bigBossPassword,
      email: 'raiden@aotd.com',
      phone_number: '+1 555-555-3141',
      post_code: '82394',
      birth_year: 1996,
      is_email_confirmed: true,
      is_phone_number_confirmed: false,
      is_email_contact_consent_granted: false,
      is_sms_contact_consent_granted: false,
      gender_id: knex('gender').select('gender_id').where({ gender_name: 'male' }),
      disability_id: knex('disability').select('disability_id').where({ disability_name: 'yes' }),
      ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
    });

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Raiden' }),
      organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Black Mesa Research' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VOLUNTEER_ADMIN' }),
    });

  /*
   * Turret - VOLUNTEER_ADMIN / VISITOR
   */
  await knex('user_account')
    .insert({
      user_name: 'Turret',
      user_password: gladosPassword,
      qr_code: 'friend',
      email: '1010@aperturescience.com',
      phone_number: '+1 555-555-3141',
      post_code: '82394',
      birth_year: 1999,
      is_email_confirmed: true,
      is_phone_number_confirmed: false,
      is_email_contact_consent_granted: false,
      is_sms_contact_consent_granted: false,
      gender_id: knex('gender').select('gender_id').where({ gender_name: 'male' }),
      disability_id: knex('disability').select('disability_id').where({ disability_name: 'yes' }),
      ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
    });

  await knex('user_account_access_role')
    .insert([
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Turret' }),
        organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Aperture Science' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VOLUNTEER_ADMIN' }),
      },
      {
        user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Turret' }),
        organisation_id: knex('organisation').select('organisation_id'). where({ organisation_name: 'Aperture Science' }),
        access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VISITOR' }),
      }
    ]);

  /*
   * Companion Cube - VISITOR
   */
  await knex('user_account')
    .insert({
      user_name: 'Companion Cube',
      qr_code: 'thecakeisalie',
      email: '',
      phone_number: '+1 425-450-4464',
      post_code: '49829',
      birth_year: null,
      is_email_confirmed: false,
      is_phone_number_confirmed: false,
      is_email_contact_consent_granted: false,
      is_sms_contact_consent_granted: false ,
      gender_id: knex('gender').select('gender_id').where({ gender_name: 'female' }),
      disability_id: knex('disability').select('disability_id').where({ disability_name: 'no' }),
      ethnicity_id: knex('ethnicity').select('ethnicity_id').where({ ethnicity_name: 'prefer not to say' }),
    });

  await knex('user_account_access_role')
    .insert({
      user_account_id: knex('user_account').select('user_account_id').where({ user_name: 'Companion Cube' }),
      organisation_id: knex('organisation').select('organisation_id').where({ organisation_name: 'Aperture Science' }),
      access_role_id: knex('access_role').select('access_role_id').where({ access_role_name: 'VISITOR' }),
    });
}

exports.reset = async (knex) => {
  await knex('user_account').truncate();
  await knex('user_account_access_role').truncate();
}

