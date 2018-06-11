# Database

## Data Model

![[Current data model]](./assets/data_model.png)

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

## Drop
TBD
