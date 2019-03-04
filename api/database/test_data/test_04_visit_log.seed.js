const moment = require('moment');
const today = moment();

exports.seed = (knex) =>
  knex('visit_log')
    .insert([
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(7, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(6, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(5, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(4, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(3, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(2, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Free Running'}),
        created_at: (today.clone().subtract(1, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.clone().subtract(1, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.clone().subtract(15, 'days')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Chell'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.clone().subtract(22, 'day')),
      },
      { 
        user_account_id: knex('user_account').select('user_account_id').where({user_name: 'Companion Cube'}),
        visit_activity_id: knex('visit_activity').select('visit_activity_id').where({visit_activity_name: 'Wear Pink'}),
        created_at: (today.clone().subtract(3, 'day')),
      },
  ]);
