import * as Knex from 'knex';

exports.seed = (knex: Knex) =>
  knex('subscription_type')
    .insert([
      { subscription_type_name: 'community_business:full' },
      { subscription_type_name: 'community_business:volunteer' },
      { subscription_type_name: 'community_business:visitor' },
      { subscription_type_name: 'sector_organisation:full' },
    ]);
