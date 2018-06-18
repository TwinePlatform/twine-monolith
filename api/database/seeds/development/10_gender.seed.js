exports.seed = (knex) =>
  knex('gender')
    .truncate()
    .insert([
      { gender_name: 'female' },
      { gender_name: 'male' },
      { gender_name: 'prefer not to say' },
    ]);
