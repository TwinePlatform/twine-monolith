import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { getCommunityBusiness } from '../prerequisites';
import { CommunityBusiness } from '../../../models';


export default [
  {
    method: 'GET',
    path: '/organisations/{organisationId}/questions/{questionId}/cls',
    options: {
      auth: {
        strategy: 'external',
        scope: ['frontline'],
      },
      pre: [
        { method: getCommunityBusiness, assign: 'communityBusiness' },
      ],
    },
    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const {
        server: { app: { knex } },
        params: { questionId },
        pre: { communityBusiness },
      } = request;

      const cb = <CommunityBusiness> communityBusiness;

      const res = await knex('cls_survey_benchmark_data')
        .select('score')
        .where({
          frontline_survey_question_id: knex('frontline_survey_question')
            .select('frontline_survey_question_id')
            .where({ frontline_question_uuid: questionId }),
          community_business_region_id: knex('community_business_region')
            .select('community_business_region_id')
            .where({ region_name: cb.region }),
        });

      if (res.length > 0) {
        return { region: cb.region, mean_score: res[0].score };
      }

      const resnps = await knex('nps_survey_benchmark_data')
        .select(['detractors', 'passives', 'promoters'])
        .where({
          frontline_survey_question_id: knex('frontline_survey_question')
            .select('frontline_survey_question_id')
            .where({ frontline_question_uuid: questionId }),
        });

      if (resnps.length > 0) {
        return {
          score: {
            detractors: {
              range: [0, 6],
              percentage: resnps[0].detractors,
            },
            passives: {
              range: [7, 8],
              percentage: resnps[0].passives,
            },
            promoters: {
              range: [9, 10],
              percentage: resnps[0].promoters,
            },
          },
        };
      }

      throw Boom.notFound(`Question with id: ${questionId} not found`);
    },
  },
] as Hapi.ServerRoute[];
