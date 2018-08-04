exports.seed = (knex) =>
  knex('organisation')
    .insert([
      {
        organisation_name: 'Aperture Science',
        _360_giving_id: '01111000',
      },
      {
        organisation_name: 'Black Mesa Research',
        _360_giving_id: '01111001',
      },
      {
        organisation_name: 'Umbrella Corporation',
        _360_giving_id: '01111002',
      },
    ]);
