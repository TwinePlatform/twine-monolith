const { factory } = require('factory-girl');

factory.define('user', Object, {
  name: factory.chance('name'),
  password: factory.chance('string'),
  email: factory.chance('email'),
});

factory.extend('user', 'cbAdmin', {
  isEmailConfirmed: factory.chance('bool'),
});

factory.extend('user', 'visitor', {
  name: factory.chance('name'),
  email: factory.chance('email'),
  phoneNumber: factory.chance('phone', { country: 'uk' }),
  qrCode: factory.chance('string'),
  gender: factory.chance('pickone', ['male', 'female', 'prefer not to say']),
  disability: factory.chance('pickone', ['yes', 'no', 'prefer not to say']),
  ethnicity: factory.chance('pickone', ['prefer not to say']),
  birthYear: factory.chance('integer', { min: 1900, max: 2018 }),
  postCode: factory.chance('postal'),
  isEmailConfirmed: factory.chance('bool'),
  isPhoneNumberConfirmed: factory.chance('bool'),
  isEmailConsentGranted: factory.chance('bool'),
  isSMSConsentGranted: factory.chance('bool'),
});

factory.extend('user', 'volunteer', {
  name: factory.chance('name'),
  email: factory.chance('email'),
  phoneNumber: factory.chance('phone', { country: 'uk' }),
  gender: factory.chance('pickone', ['male', 'female', 'prefer not to say']),
  disability: factory.chance('pickone', ['yes', 'no', 'prefer not to say']),
  ethnicity: factory.chance('pickone', ['prefer not to say']),
  birthYear: factory.chance('integer', { min: 1900, max: 2018 }),
  postCode: factory.chance('postal'),
  isEmailConfirmed: factory.chance('bool'),
  isPhoneNumberConfirmed: factory.chance('bool'),
  isEmailConsentGranted: factory.chance('bool'),
  isSMSConsentGranted: factory.chance('bool'),
});

factory.define('organisation', Object, {
  name: factory.chance('word'),
  _360GivingId: factory.chance('string'),
});

factory.extend('organisation', 'communityBusiness', {
  region: factory.chance('pickone', ['London', 'Yorkshire and the Humber', 'North East']),
  sector: factory.chance('pickone', ['Arts centre or facility', 'Energy', 'Housing', 'Transport']),
  logoUrl: factory.chance('url'),
  address1: factory.chance('address'),
  townCity: factory.chance('city'),
  postCode: factory.chance('postal'),
  turnoverBand: factory.chance('pickone', ['<£100k', '£100k-£250k', '£500k-£750k']),
});

export default factory;
