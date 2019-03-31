import * as Knex from 'knex';

exports.seed = (knex: Knex) =>
  knex('community_business_region')
    .insert([
      { region_name: 'East Midlands' },
      { region_name: 'East of England' },
      { region_name: 'London' },
      { region_name: 'North East' },
      { region_name: 'North West' },
      { region_name: 'South East' },
      { region_name: 'South West' },
      { region_name: 'West Midlands' },
      { region_name: 'Yorkshire and the Humber' },
    ]);
