exports.seed = (knex) =>
  knex('outreach_meeting_type')
    .insert([
      { outreach_meeting_type_name: 'First contact' },
      { outreach_meeting_type_name: 'Follow-up from previous interaction' },
      { outreach_meeting_type_name: 'Event' },
    ]);
