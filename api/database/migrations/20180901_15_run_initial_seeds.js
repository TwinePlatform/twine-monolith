const fs = require('fs');
const path = require('path');
const { getEnvironment } = require('../../build/config')


exports.up = async (knex) => {
  const NODE_ENV = getEnvironment(process.env.NODE_ENV);
  const basePath = path.resolve(__dirname, '..', 'seeds', NODE_ENV);
  const files = fs.readdirSync(basePath);
  const fns = files.sort().map((file) => require(path.join(basePath, file)).seed);

  for (let i = 0; i < fns.length; i++) {
    await fns[i](knex);
  }
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
    .then(() => knex('visit_log').truncate())
    .then(() => knex('visit_feedback').truncate())
    .then(() => knex('volunteer_hours_log').truncate())
};
