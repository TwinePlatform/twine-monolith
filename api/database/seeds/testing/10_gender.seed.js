exports.seed = (knex) =>
  knex('gender')
    .insert([
      { gender_name: 'female' },
      { gender_name: 'male' },
      { gender_name: 'prefer not to say' },
    ]);
