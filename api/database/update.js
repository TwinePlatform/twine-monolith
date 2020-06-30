console.log('Trying to update...');

var knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '2020Yeap!',
        database: 'template1'
    }
});

// ALTER TABLE user_account ADD COLUMN push_token varchar; 
// ALTER TABLE volunteer_hours_log ADD COLUMN notes varchar;

async function alter_table() {
    const push_token = await knex.schema.table('user_account', function (table) {
        table.string('push_token');
    })

    console.log(push_token);

    const notes = await knex.schema.table('volunteer_hours_log', function (table) {
        table.string('notes');
    })

    console.log(notes);
}

alter_table();

console.log('update successful !');


