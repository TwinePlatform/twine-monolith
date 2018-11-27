const getOrgId = (k, s) =>
  k('organisation')
    .select('organisation_id')
    .where({ organisation_name: s });

exports.seed = (knex) =>
  knex('volunteer_project')
    .insert([
      {
        volunteer_project_name: 'Party',
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
      },
      {
        volunteer_project_name: 'Party',
        organisation_id: getOrgId(knex, 'Aperture Science'),
      },
      {
        volunteer_project_name: 'Community dinner',
        organisation_id: getOrgId(knex, 'Aperture Science'),
      },
      {
        volunteer_project_name: 'Take over the world',
        organisation_id: getOrgId(knex, 'Black Mesa Research'),
      },
    ])
