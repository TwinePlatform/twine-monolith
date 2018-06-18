exports.seed = (knex) =>
  knex('visit_activity_category')
    .insert([
      { visit_activity_category_name: 'Sports' },
      { visit_activity_category_name: 'Arts, Craft, and Music' },
      { visit_activity_category_name: 'Physical health and wellbeing' },
      { visit_activity_category_name: 'Socialising' },
      { visit_activity_category_name: 'Adult skills building' },
      { visit_activity_category_name: 'Education support' },
      { visit_activity_category_name: 'Employment support' },
      { visit_activity_category_name: 'Business support' },
      { visit_activity_category_name: 'Care service' },
      { visit_activity_category_name: 'Mental health support' },
      { visit_activity_category_name: 'Housing support' },
      { visit_activity_category_name: 'Work space' },
      { visit_activity_category_name: 'Food' },
      { visit_activity_category_name: 'Outdoor work and gardening' },
      { visit_activity_category_name: 'Local products' },
      { visit_activity_category_name: 'Environment and conservation work' },
      { visit_activity_category_name: 'Transport' },
    ]);
