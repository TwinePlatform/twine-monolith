import * as Knex from 'knex';

exports.seed = (knex: Knex) =>
  knex('gender')
    .insert([
      { gender_name: 'female' },
      { gender_name: 'male' },
      { gender_name: 'prefer not to say' },
    ]);
