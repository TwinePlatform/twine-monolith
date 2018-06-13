exports.seed = (knex) =>
  knex('outreach_campaign_target_type')
    .truncate()
    .insert([
      { outreach_campaign_target_name: 'Community group' },
      { outreach_campaign_target_name: 'Resident' },
      { outreach_campaign_target_name: 'Investor' },
      { outreach_campaign_target_name: 'Local business' },
      { outreach_campaign_target_name: 'Local professional forum' },
      { outreach_campaign_target_name: 'Local media' },
      { outreach_campaign_target_name: 'National media' },
      { outreach_campaign_target_name: 'Corporate' },
      { outreach_campaign_target_name: 'Larger Corporate' },
      { outreach_campaign_target_name: 'Local authority – elected member' },
      { outreach_campaign_target_name: 'Local authority – officer – asset management' },
      { outreach_campaign_target_name: 'Local authority – officer – other' },
      { outreach_campaign_target_name: 'Local authority – officer' },
      { outreach_campaign_target_name: 'Energy Provider' },
    ]);
