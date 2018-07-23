import { Dictionary } from 'ramda';
import * as Knex from 'knex';

export const getTrx = (context: Dictionary<any>, client: Knex) =>
  new Promise((resolve) =>
    client.transaction((transactionScope: Knex.Transaction) => {
      context.trx = transactionScope;
      resolve();
    })
    .catch(() => {})
  );
