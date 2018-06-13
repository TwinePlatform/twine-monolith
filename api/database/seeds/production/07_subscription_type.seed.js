exports.seed = (knex) =>
  knex('subscription_type')
    .truncate()
    .insert([
      { subscription_type_name: 'community_business:full' },
      { subscription_type_name: 'community_business:volunteer' },
      { subscription_type_name: 'community_business:visitor' },
      { subscription_type_name: 'sector_organisation:full' },
    ]);
