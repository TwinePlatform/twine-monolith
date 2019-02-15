# 🗃 Database

## Contents
1. [Data model](#data-model)
2. [Migrations](#migrations)
3. [Seeds](#seeds)
4. [Backups](#backups)

## Data Model

![[Current data model]](./assets/data_model.png)

Note: the data types in the diagram are for illustration purposes only. For the real data types, see the [migrations](../database/migrations/sql).

This diagram was generated using [DB designer](https://dbdesigner.net). Ask for login details to edit the diagram.


## Migrations
All migrations are held in the `/database/migrations` directory. Run migrations using the `knex` CLI or run the latest migration with
```
$ npm run migrate:latest
```

Create a new migration with
```
$ npm run migrate:make <NAME>
```

Migrations have two components:
1. A SQL file describing the "up" migration
2. A js file serving as an interface to `knex`

This approach was chosen to allow use of the `knex` cli while still being able to specify migrations in plain SQL. Both files will be created for you by the `migrate:make` command, and only the SQL file will need to be altered.

**Note** that _"down"_ migrations are not utilised in this project. All migrations are _"up"_.
**Note** the `NODE_ENV` should be specified when running the migration.

## Seeds
Seeds are held in the `/database/seeds` directory. Run seeds using the `knex` CLI or using the `npm` script:
```
$ npm run seed:run
```
Create a new seed with the `knex` CLI or with
```
$ npm run seed:make
```

**Note** the `NODE_ENV` should be specified when running the seed.

## Drop
To drop all tables and data types created by the migrations, run
```
$ npm run migrate:teardown
```

## Backups
### Schedule Backups
Backups are scheduled to run everyday at 3am, and are retained for 7 days.

Current status of backups
```
heroku pg:backups --app [app-name]
```
❗️ If at any point heroku is upgraded from hobby to production tier, backups will need to be rescheduled.

Change backup schedule
```
heroku pg:backups:schedule DATABASE_URL --at '[time] [TZ format]' --app [app-name]
```

### Local Test Restore
A test restore can either be done locally or on a staging pipeline to check the integrety of the backup. Be careful not to restore to the production database as it will be wiped during the process 😨.

Use the `clone_db` script:
```
$ npm run exec ./bin/clone_db.ts -- <DB_NAME>
```
See documentation in the script file for more information.

You can now connect your local app to the restored database.

### Resources
- [Heroku PostgreSQL backups](https://devcenter.heroku.com/articles/heroku-postgres-backups)
- [Heroku importing and exporting PostgreSQL databases](https://devcenter.heroku.com/articles/heroku-postgres-import-export)
