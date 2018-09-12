import * as Knex from 'knex';
import { intersection, compose, isNil } from 'ramda';
import { ModelQuery } from './types';


export const Utils: {
  [k: string]: (...a: any[]) => (q: Knex.QueryBuilder) => Knex.QueryBuilder
} = {
  limit: (n: number) => (q: Knex.QueryBuilder) => q.limit(n),
  offset: (n: number) => (q: Knex.QueryBuilder) => q.offset(n),
  order: (c: string, d: string) => (q: Knex.QueryBuilder) => q.orderBy(c, d),
  where: (o: any) => (q: Knex.QueryBuilder) => q.where(o),
  whereNot: (o: any) => (q: Knex.QueryBuilder) => q.whereNot(o),
  whereBetween: (o: {columnName: string, range: [number, number]}) =>
    (q: Knex.QueryBuilder) => q.whereBetween(o.columnName, o.range),
};

export const applyQueryModifiers =
  <T>(p: Knex.QueryBuilder, opts: ModelQuery<T>): Knex.QueryBuilder => {

    const modifiers = intersection(Object.keys(opts), Object.keys(Utils));

    const query = modifiers
    .reduce((acc, k: keyof ModelQuery<T>) => {
      if (k === 'limit' && !isNil(opts.limit)) {
        return compose(Utils.limit(opts.limit), acc);

      } else if (k === 'offset' && !isNil(opts.offset)) {
        return compose(Utils.offset(opts.offset), acc);

      } else if (k === 'order' && !isNil(opts.order)) {
        return compose(Utils.order(...opts.order), acc);

      } else if (k === 'where' && !isNil(opts.where)) {
        return compose(Utils.where(opts.where), acc);

      } else if (k === 'whereNot' && !isNil(opts.whereNot)) {
        return compose(Utils.whereNot(opts.whereNot), acc);

      } else if (k === 'whereBetween' && !isNil(opts.whereBetween)) {
        return compose(Utils.whereBetween(opts.whereBetween), acc);

      } else {
        /* istanbul ignore next */
        return acc;

      }
    }, (a?: any) => p);

    return query();
  };
