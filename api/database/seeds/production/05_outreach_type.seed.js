exports.seed = (knex) =>
  knex('outreach_type')
    .truncate()
    .insert([
      { outreach_type_name: 'Community Share Issue' },
      { outreach_type_name: 'Crowdfunding (donations)' },
      { outreach_type_name: 'Asset Transfer' },
      { outreach_type_name: 'Community Energy Project' },
      { outreach_type_name: 'Community Housing Project' },
      { outreach_type_name: 'Public Services Commissioning' },
    ]);
