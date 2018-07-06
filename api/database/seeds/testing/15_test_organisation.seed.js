exports.seed = (knex) =>
  knex('organisation')
    .insert([
      { organisation_name: 'Aperture Science',
      _360_giving_id: '01111000',
    }]);
