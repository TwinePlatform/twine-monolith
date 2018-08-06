const cls = require('../../static/2018_cls_benchmarks.json');
const nps = require('../../static/2018_nps_benchmarks.json');


exports.seed = (knex) => {
  const clsInsertData =
    Object.entries(cls)
      .reduce((acc, [questionId, means]) =>
        acc.concat(
          Object.entries(means)
            .map(([region, score]) => ({
              score,
              frontline_survey_question_id: knex('frontline_survey_question')
                .select('frontline_survey_question_id')
                .where({ frontline_question_uuid: questionId }),
              community_business_region_id: knex('community_business_region')
                .select('community_business_region_id')
                .where({ region_name: region }),
            }))
        )
      , []);

  const npsInsertData =
    Object.entries(nps)
      .reduce((acc, [questionId, scores]) =>
        acc.concat({
          ...scores,
          frontline_survey_question_id: knex('frontline_survey_question')
            .select('frontline_survey_question_id')
            .where({ frontline_question_uuid: questionId }),
        })
      , []);

  return Promise.all([
    knex('cls_survey_benchmark_data').insert(clsInsertData),
    knex('nps_survey_benchmark_data').insert(npsInsertData)
  ]);
};
