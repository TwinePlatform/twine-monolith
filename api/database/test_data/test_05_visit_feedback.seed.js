const moment = require('moment');
const day = moment('2018-08-05T10:43:22.231');

exports.seed = (knex) =>
  knex('visit_feedback')
    .insert([
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: -1,
        created_at: day.clone().day(-7).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: day.clone().day(-7).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: day.clone().day(-6).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 1,
        created_at: day.clone().day(-6).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: -1,
        created_at: day.clone().day(-5).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: day.clone().day(-5).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: day.clone().day(-4).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 1,
        created_at: day.clone().day(-3).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 1,
        created_at: day.clone().day(-2).toISOString(),
      },
  ]);
