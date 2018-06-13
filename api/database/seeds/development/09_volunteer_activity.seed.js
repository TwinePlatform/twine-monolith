exports.seed = (knex) =>
  knex('volunteer_activity')
    .insert([
      { volunteer_activity_name: 'Helping with raising funds (shop, events…)' },
      { volunteer_activity_name: 'Outdoor and practical work' },
      { volunteer_activity_name: 'Community outreach and communications' },
      { volunteer_activity_name: 'Committee work, AGM' },
      { volunteer_activity_name: 'Office support' },
      { volunteer_activity_name: 'Support and Care for vulnerable community members' },
      { volunteer_activity_name: 'Professional pro bono work (Legal, IT, Research)' },
      { volunteer_activity_name: 'Other' },
    ]);
