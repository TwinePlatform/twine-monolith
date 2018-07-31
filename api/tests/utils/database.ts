/*
 * Utility methods for tests that touch the database
 */
import * as Knex from 'knex';


/*
 * Open a transaction and resolve with the transaction object.
 * Used so that all tests within a suite can be run within a transaction
 * (to be rolled back in an "afterEach" hook). This speeds up tests
 * significantly compared to truncating and re-seeding the entire DB for
 * each test
 *
 * A no-op `catch` is required because `trx.rollback` throws an exception,
 * which we want to ignore, since the rollback will happen at the end of
 * every test
 *
 * Adapted from:
 * - https://github.com/tgriesser/knex/issues/2076
 * - https://gist.github.com/odigity/7f37077de74964051d45c4ca80ec3250
 */
export const getTrx = (client: Knex): Promise<Knex.Transaction> =>
  new Promise((resolve) =>
    client.transaction(resolve)
    .catch(() => {})
  );
