const moment = require('moment');
const today = moment();

exports.seed = (knex) =>
  knex('visit')
    .insert([
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-7)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-6)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-5)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-4)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-3)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-2)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.day(-1)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.day(-1)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.day(-15)),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.day(-22)),
      },
  ]);
