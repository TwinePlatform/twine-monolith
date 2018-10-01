const path = require('path');
const { getEnvironment, Environment } = require('../../build/config')


exports.up = (knex) => {
  const NODE_ENV = getEnvironment(process.env.NODE_ENV);
  const basePath = path.resolve(__dirname, '..', 'seeds', NODE_ENV);

  return require(path.join(basePath, '01_community_business_region.seed.js')).seed(knex)
    .then(() => require(path.join(basePath, '02_community_buiness_sector.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '03_outreach_campaign_target.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '04_outreach_meeting_type.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '05_outreach_type.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '06_outreach_campaign_valid_target.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '07_subscription_type.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '08_visit_activity_category.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '09_volunteer_activity.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '10_gender.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '11_access_role.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '12_disability.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '13_ethnicity.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '14_permissions.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '15_access_role_permission.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '16_frontline_survey_questions.seed.js')).seed(knex))
    .then(() => require(path.join(basePath, '17_cls_and_nps_benchmarks.seed.js')).seed(knex))
    .then(() =>
        NODE_ENV !== Environment.PRODUCTION
          ? require(path.join(basePath, '18_test_user.seed.js')).seed(knex)
              .then(() => require(path.join(basePath, '19_test_organisation.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '20_test_user_role.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '21_test_api_token.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '22_test_community_business.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '23_test_visit_activity.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '24_test_visit.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '25_test_visit_feedback.seed.js')).seed(knex))
              .then(() => require(path.join(basePath, '26_test_volunteer_hours_log.seed.js')).seed(knex))
          : Promise.resolve()
    )
};

exports.down = (knex) => {
  knex('community_business_region').truncate()
    .then(() => knex('community_business_sector').truncate())
    .then(() => knex('outreach_campaign_target').truncate())
    .then(() => knex('outreach_meeting_type').truncate())
    .then(() => knex('community_business_sector').truncate())
    .then(() => knex('outreach_type').truncate())
    .then(() => knex('outreach_campaign_valid_target').truncate())
    .then(() => knex('subscription_type').truncate())
    .then(() => knex('visit_activity_category').truncate())
    .then(() => knex('volunteer_activity').truncate())
    .then(() => knex('gender').truncate())
    .then(() => knex('access_role').truncate())
    .then(() => knex('disability').truncate())
    .then(() => knex('ethnicity').truncate())
    .then(() => knex('permissions').truncate())
    .then(() => knex('access_role_permission').truncate())
    .then(() => knex('frontline_survey_questions').truncate())
    .then(() => knex('cls_and_nps_benchmarks').truncate())
    .then(() => knex('user_account').truncate())
    .then(() => knex('organisation').truncate())
    .then(() => knex('user_account_access_role').truncate())
    .then(() => knex('api_token').truncate())
    .then(() => knex('community_business').truncate())
    .then(() => knex('visit_activity').truncate())
    .then(() => knex('visit').truncate())
    .then(() => knex('visit_feedback').truncate())
    .then(() => knex('volunteer_hours_log').truncate())
};
