# Test, Demo & QA Data

Dummy data is provided for test, QA and demo environments. All dummy data is stored in `/database/data`.

| Directory | Intended use |
|-----------|--------------|
| `/database/data/testing` | Automated testing |
| `/database/data/qa` | Manual QA testing |
| `/database/data/demo` | Demonstrations and training |

In order to insert any of these datasets, run the following command:
```
$ npm run exec bin/insert_data.ts -- <DATASET>
```
Where `<DATASET>` is one of the subdirectories. You can affect which database is targeted through use of the `NODE_ENV` environment variable in the standard way.

Each data file should export an object:
```ts
{
  seed: (client: Knex) => Promise<any>
  reset?: (client: Knex) => Promise<any>
}
```
Where the `seed` function performs whatever operations are necessary to insert the test data, and `reset` is an optional function that can remove the inserted data from the database.
