exports.seed = (knex) =>
  knex('community_business_region')
    .insert([
      { region_name: 'North East' },
      { region_name: 'North West' },
      { region_name: 'Midlands' },
      { region_name: 'Wales' },
      { region_name: 'South West' },
      { region_name: 'South East' },
      { region_name: 'Greater London' },
    ]);
