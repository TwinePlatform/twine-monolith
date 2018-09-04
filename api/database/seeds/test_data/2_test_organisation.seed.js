exports.seed = (knex) =>
  knex('organisation')
    .insert([
      {
        organisation_name: 'Aperture Science',
        _360_giving_id: 'GB-COH-3205',
      },
      {
        organisation_name: 'Black Mesa Research',
        _360_giving_id: 'GB-COH-9302',
      },
      {
        organisation_name: 'Umbrella Corporation',
        _360_giving_id: 'GB-COH-298435',
      },
    ]);
