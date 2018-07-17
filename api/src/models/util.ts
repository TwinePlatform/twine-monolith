import * as Knex from 'knex';
import { intersection, compose } from 'ramda';
import { CommonQueryOptions } from './models';


export const Utils: {
  [k: string]: (...a: any[]) => (q: Knex.QueryBuilder) => Knex.QueryBuilder
} = {
  limit: (n: number) => (q: Knex.QueryBuilder) => q.limit(n),
  offset: (n: number) => (q: Knex.QueryBuilder) => q.offset(n),
  order: (c: string, d: string) => (q: Knex.QueryBuilder) => q.orderBy(c, d),
};

export const applyQueryModifiers = (p: Knex.QueryBuilder, opts: CommonQueryOptions) => {
  const modifiers = intersection(Object.keys(opts), Object.keys(Utils));

  const query = modifiers
    .reduce((acc, k: keyof CommonQueryOptions) => {
      if (k === 'limit') {
        return compose(Utils.limit(opts.limit), acc);

      } else if (k === 'offset') {
        return compose(Utils.offset(opts.offset), acc);

      } else if (k === 'order') {
        return compose(Utils.order(...opts.order), acc);

      } else {
        return acc;

      }
    }, (a?: any) => p);

  return query();
};
