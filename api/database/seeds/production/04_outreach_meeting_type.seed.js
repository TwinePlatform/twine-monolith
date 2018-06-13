exports.seed = (knex) =>
  knex('outreach_meeting_type')
    .truncate()
    .insert([
      { outreach_meeting_type_name: 'First contact' },
      { outreach_meeting_type_name: 'Follow-up from previous interaction' },
      { outreach_meeting_type_name: 'Event' },
    ]);
