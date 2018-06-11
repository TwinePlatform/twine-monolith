exports.seed = (knex) => {
  const getTypeIdByName = (name) =>
    knex('outreach_type')
      .select('outreach_type_id')
      .where({ outreach_type_name: name });

  const getTargetIdByName = (name) =>
    knex('outreach_campaign_target_type')
      .select('outreach_campaign_target_type_id')
      .where({ outreach_campaign_target_name: name });


  return knex('outreach_campaign_target')
    .truncate()
    .insert([
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('Community Group') },
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('Resident') },
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('Investor') },
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('Local business') },
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('Local professional forum') },
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('Local media') },
      { outreach_type_id: getTypeIdByName('Community Share Issue'), outreach_campaign_target_type_id: getTargetIdByName('National media') },

      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Community Group') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Resident') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Investor') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Local business') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Local professional forum') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Local media') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('National media') },
      { outreach_type_id: getTypeIdByName('Crowdfunding (donations)'), outreach_campaign_target_type_id: getTargetIdByName('Larger Corporate') },

      { outreach_type_id: getTypeIdByName('Asset Transfer'), outreach_campaign_target_type_id: getTargetIdByName('Local business') },
      { outreach_type_id: getTypeIdByName('Asset Transfer'), outreach_campaign_target_type_id: getTargetIdByName('Larger Corporate') },

      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Community Group') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Resident') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Investor') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local business') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local media') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('National media') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local authority – elected member') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local authority – officer – asset management') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local authority – officer – other') },

      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Community Group') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Resident') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Investor') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local media') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('National media') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Corporate') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Local authority – officer') },
      { outreach_type_id: getTypeIdByName('Community Energy Project'), outreach_campaign_target_type_id: getTargetIdByName('Energy Provider') },

      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Community Group') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Resident') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Investor') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Local media') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('National media') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Corporate') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Local authority – elected member') },
      { outreach_type_id: getTypeIdByName('Public Services Commissioning'), outreach_campaign_target_type_id: getTargetIdByName('Local authority – officer') },
    ]);
};
