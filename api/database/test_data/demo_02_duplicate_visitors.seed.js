/*
 * Users intended as visitors to demonstrate various conflicts in the "Sign in with name" feature
 */
const { createHmac, randomBytes } = require('crypto');

const hash = () =>
  createHmac('sha256', randomBytes(4).toString('hex'))
    .update(randomBytes(16).toString('hex'))
    .digest('hex')

exports.seed = async (client) => {
  const res = await client('user_account')
    .insert([
      // 01. name -> postCode -> GO  (Dupe name, unique postCode)
      //
      // 01 (visitorOne,  SH3 4ND,  null,      null,        visitorOne1@example.com),
      //    (visitorOne,  BR8 9EE,  null,      null,        visitorOne2@example.com),
      {
        user_name: 'visitorOne',
        email: 'visitorOne1@example.com',
        post_code: 'SH3 4ND',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorOne',
        email: 'visitorOne2@example.com',
        post_code: 'BR8 9EE',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 02. name -> birthYear -> GO  (Dupe name, null postCode, unique birthYear)
      //
      // 02 (visitorTwo,  null,     1982,      null,        visitorTwo1@example.com),
      //    (visitorTwo,  null,     1999,      null,        visitorTwo@example.com),
      {
        user_name: 'visitorTwo',
        email: 'visitorTwo1@example.com',
        birth_year: 1982,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorTwo',
        email: 'visitorTwo2@example.com',
        birth_year: 1999,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 03. name -> phoneNumber -> GO  (Dupe name, null postCode, null birthYear, unique phoneNumber)
      //
      // 03 (visitorThree,  null,     null,      07777777771, null),
      //    (visitorThree,  null,     null,      07777777772, null),
      {
        user_name: 'visitorThree',
        phone_number: '07777777771',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorThree',
        phone_number: '07777777772',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 04. name -> email -> GO  (Dupe name, null postCode, null birthYear, null phoneNumber, unique email)
      //
      // 04 (visitorFour,  null,     null,      null       , visitorFour1@example.com),
      //    (visitorFour,  null,     null,      null       , visitorFour2@example.com),
      {
        user_name: 'visitorFour',
        email: 'visitorFour1@example.com',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorFour',
        email: 'visitorFour2@example.com',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 05. name -> birthYear -> GO  (Dupe name, dupe postCode, unique birthYear)
      //
      // 05 (visitorFive,  MN1 3OF,  1955,      null       , visitorFive1@example.com),
      //    (visitorFive,  MN1 3OF,  1970,      null       , visitorFive1@example.com),
      {
        user_name: 'visitorFive',
        email: 'visitorFive1@example.com',
        post_code: 'MN1 3OF',
        birth_year: 1955,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorFive',
        email: 'visitorFive2@example.com',
        post_code: 'MN1 3OF',
        birth_year: 1970,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 06. name -> phoneNumber -> GO  (Dupe name, dupe postCode, null birthYear, unique phoneNumber)
      //
      // 06 (visitorSix,  MN1 3OF,  null,      07777777773, null),
      //    (visitorSix,  MN1 3OF,  null,      07777777774, null),
      {
        user_name: 'visitorSix',
        phone_number: '07777777773',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorSix',
        phone_number: '07777777774',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 07. name -> email -> GO  (Dupe name, dupe postCode, null birthYear, null phoneNumber, unique email)
      //
      // 07 (pqr,  MN1 3OF,  null,      null       , pqr1@example.com),
      //    (pqr,  MN1 3OF,  null,      null       , pqr2@example.com),
      {
        user_name: 'visitorSeven',
        email: 'visitorSeven1@example.com',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorSeven',
        email: 'visitorSeven2@example.com',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 08. name -> phoneNumber -> GO  (Dupe name, dupe postCode, dupe birthYear, unique phoneNumber)
      //
      // 08 (visitorEight,  MN1 3OF,  1992,      07777777775, null),
      //    (visitorEight,  MN1 3OF,  1992,      07777777776, null),
      {
        user_name: 'visitorEight',
        phone_number: '07777777775',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorEight',
        phone_number: '07777777776',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 09. name -> email -> GO  (Dupe name, dupe postCode, dupe birthYear, null phoneNumber, unique email)
      //
      // 09 (visitorNine,  MN1 3OF,  1993,      null       , visitorNine1@example.com),
      //    (visitorNine,  MN1 3OF,  1993,      null       , visitorNine2@example.com),
      {
        user_name: 'visitorNine',
        email: 'visitorNine1@example.com',
        post_code: 'MN1 3OF',
        birth_year: 1993,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorNine',
        email: 'visitorNine2@example.com',
        post_code: 'MN1 3OF',
        birth_year: 1993,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 10. name -> phoneNumber -> GO  (Dupe name, null postCode, dupe birthYear, unique phoneNumber)
      //
      // 10 (visitorTen,  null,     1992,      07777777777, null),
      //    (visitorTen,  null,     1992,      07777777778, null),
      {
        user_name: 'visitorTen',
        phone_number: '07777777777',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorTen',
        phone_number: '07777777778',
        post_code: 'MN1 3OF',
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },

      // 11. name -> email -> GO  (Dupe name, null postCode, dupe birthYear, null phoneNumber, unique email)
      //
      // 11 (visitorEleven,  null,     1993,      null       , visitorEleven1@example.com),
      //    (visitorEleven,  null,     1993,      null       , visitorEleven2@example.com),
      {
        user_name: 'visitorEleven',
        email: 'visitorEleven1@example.com',
        birth_year: 1993,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
      {
        user_name: 'visitorEleven',
        email: 'visitorEleven2@example.com',
        birth_year: 1993,
        qr_code: hash(),
        gender_id: 2,
        ethnicity_id: 1,
        disability_id: 1,
      },
    ])
    .returning('user_account_id');

  return client('user_account_access_role')
    .insert(
      res.map(r => ({
        user_account_id: r,
        access_role_id: client('access_role').select('access_role_id').where({ access_role_name: 'VISITOR' }),
        organisation_id: client('organisation').select('organisation_id').where({ organisation_name: 'Twine Community Center' }),
      }))
    )
}
