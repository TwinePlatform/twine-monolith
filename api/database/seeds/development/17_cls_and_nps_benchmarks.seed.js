const cls = require('../cls_benchmarks.json');
const nps = require('../nps_benchmarks.json');


exports.seed = (knex) => {
  const clsInsertData =
    Object.entries(cls)
      .reduce((acc, [questionId, means]) =>
        acc.concat(
          Object.entries(means)
            .map(([region, score]) => ({
              frontline_survey_question_id: questionId,
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
      .reduce((acc, [questionId, scores]) =>
        acc.concat({
          frontline_survey_question_id: questionId,
          ...scores,
          benchmark_year: 2018,
        })
      , []);

  return Promise.all([
    knex('cls_survey_benchmark_data').insert(clsInsertData),
    knex('nps_survey_benchmark_data').insert(npsInsertData)
  ]);
};
