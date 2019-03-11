# Test & Demo Data

All test and demo data is stored in `/database/test_data`. Data intended for use in automated testing is stored in files beginning with `test_NN`, and data intended for use during demonstrations, training and manual user testing is stored in files beginniner with `demo_NN`.

In order to insert demo data, run the following command:
```
$ npm run exec bin/insert_data.ts demo
```
You can affect which database is targeted through use of the `NODE_ENV` environment variable in the standard way.

Each data file should export an object:
```ts
{
  seed: (client: Knex) => Promise<any>
  reset?: (client: Knex) => Promise<any>
}
```
Where the `seed` function performs whatever operations are necessary to insert the test data, and `reset` is an optional function that can remove the inserted data from the database.
