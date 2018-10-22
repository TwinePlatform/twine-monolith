const path = require('path');


module.exports = [
  'login',
  'organisations',
  'admin_codes',
  'logs',
]
  .map((s) => require(path.join(__dirname, s))) // eslint-disable-line
  .reduce((acc, x) => acc.concat(x)); // flatten
