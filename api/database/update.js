console.log('Trying to update...');

var knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-54-217-235-16.eu-west-1.compute.amazonaws.com',
        user: 'eibwditvfuplqo',
        password: 'bda8cbec47868f9e42f4f1f795fd37388d9db03f2fcd78fffad359a7cb1fefcb',
        database: 'd9ld2bb66r7cup'
    }
});

// ALTER TABLE user_account ADD COLUMN push_token varchar; 
// ALTER TABLE volunteer_hours_log ADD COLUMN notes varchar;

async function select() {
    const something = await knex.from('user_account').select().where('id' < 100);
    console.log(something);
}

// async function alter_table() {
//     const push_token = await knex.schema.table('user_account', function (table) {
//         table.string('push_token');
//     })

//     console.log(push_token);

//     const notes = await knex.schema.table('volunteer_hours_log', function (table) {
//         table.string('notes');
//     })

//     console.log(notes);
// }

// alter_table();
select();

console.log('update successful !');


