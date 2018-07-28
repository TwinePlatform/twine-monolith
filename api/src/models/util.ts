import * as Knex from 'knex';
import { intersection, compose } from 'ramda';
import { ModelQuery } from './types';


export const Utils: {
  [k: string]: (...a: any[]) => (q: Knex.QueryBuilder) => Knex.QueryBuilder
} = {
  limit: (n: number) => (q: Knex.QueryBuilder) => q.limit(n),
  offset: (n: number) => (q: Knex.QueryBuilder) => q.offset(n),
  order: (c: string, d: string) => (q: Knex.QueryBuilder) => q.orderBy(c, d),
  where: (o: any) => (q: Knex.QueryBuilder) => q.where(o),
  whereNot: (o: any) => (q: Knex.QueryBuilder) => q.whereNot(o),
};

export const applyQueryModifiers =
  <T>(p: Knex.QueryBuilder, opts: ModelQuery<T>): Knex.QueryBuilder => {

    const modifiers = intersection(Object.keys(opts), Object.keys(Utils));

    const query = modifiers
    .reduce((acc, k: keyof ModelQuery<T>) => {
      if (k === 'limit') {
        return compose(Utils.limit(opts.limit), acc);

      } else if (k === 'offset') {
        return compose(Utils.offset(opts.offset), acc);

      } else if (k === 'order') {
        return compose(Utils.order(...opts.order), acc);

      } else if (k === 'where') {
        return compose(Utils.where(opts.where), acc);

      } else if (k === 'whereNot') {
        return compose(Utils.whereNot(opts.whereNot), acc);

      } else {
        /* istanbul ignore next */
        return acc;

      }
    }, (a?: any) => p);

    return query();
  };
