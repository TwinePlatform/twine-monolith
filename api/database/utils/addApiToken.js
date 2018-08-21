const crypto = require('crypto');
const bcrypt = require('bcrypt');


module.exports = async (knex, name, access) => {
  const token = crypto.randomBytes(64).toString('base64');

  await knex('api_token')
    .insert({
      api_token_name: name,
      api_token_access: access,
      api_token: bcrypt.hashSync(token, 10),
    });

  return { token, name, access };
}
