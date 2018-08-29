const moment = require('moment');
const today = moment();

exports.seed = (knex) =>
  knex('visit_feedback')
    .insert([
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: -1,
        created_at: today.day(-7).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: today.day(-7).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: today.day(-6).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 1,
        created_at: today.day(-6).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: -1,
        created_at: today.day(-5).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: today.day(-5).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 0,
        created_at: today.day(-4).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 1,
        created_at: today.day(-3).toISOString(),
      },
      {
        organisation_id: knex('organisation').select('organisation_id').where({organisation_name: 'Aperture Science'}),
        score: 1,
        created_at: today.day(-2).toISOString(),
      },
  ]);
