import * as Knex from 'knex';
const cls = require('../../static/2018_cls_benchmarks.json');
const nps = require('../../static/2018_nps_benchmarks.json');

exports.seed = (knex: Knex) => {
  const clsInsertData =
    Object.entries(cls)
      .reduce((acc, [questionUUID, means]) =>
        acc.concat(
          Object.entries(means)
            .map(([region, score]) => ({
              frontline_survey_question_id: knex('frontline_survey_question')
                .select('frontline_survey_question_id')
                .where({ frontline_question_uuid: questionUUID }),
              community_business_region_id: knex('community_business_region')
                .select('community_business_region_id')
                .where({ region_name: region }),
              score,
              benchmark_year: 2018,
            }))
        )
      , []);

  const npsInsertData =
    Object.entries(nps)
      .reduce((acc, [questionUUID, scores]) =>
        acc.concat({
          ...scores,
          frontline_survey_question_id: knex('frontline_survey_question')
            .select('frontline_survey_question_id')
            .where({ frontline_question_uuid: questionUUID }),
          benchmark_year: 2018,
        })
      , []);

  return Promise.all([
    knex('cls_survey_benchmark_data').insert(clsInsertData),
    knex('nps_survey_benchmark_data').insert(npsInsertData),
  ]);
};
