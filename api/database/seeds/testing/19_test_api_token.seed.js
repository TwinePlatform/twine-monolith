exports.seed = (knex) =>
  knex('api_token')
    .insert([
      { api_token_name: 'testaccount',
        api_token_access: 'frontline',
        api_token: '$2a$12$ljINX3VanQvCEycBOqvfw.UDMd4DXiRwU23Z9Vw6IVu3TDOKbrXuG'
  }]);
