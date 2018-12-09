import * as Knex from 'knex';
import { intersection, compose, isNil, Dictionary } from 'ramda';
import { ModelQuery } from './types';

type DateLike = Date | number | undefined;

export const Utils = {
  limit: (n: number) => (q: Knex.QueryBuilder) => q.limit(n),
  offset: (n: number) => (q: Knex.QueryBuilder) => q.offset(n),
  order: (c: string, d: string) => (q: Knex.QueryBuilder) => q.orderBy(c, d),
  where: (o: any) => (q: Knex.QueryBuilder) => q.where(o),
  whereNot: (o: any) => (q: Knex.QueryBuilder) => q.whereNot(o),
  whereBetween: (o: Dictionary<[DateLike, DateLike]>) =>
    (q: Knex.QueryBuilder) =>
      Object.keys(o)
        .reduce((queryChain, whereQuery, i) => {
          if (o[whereQuery].length !== 2) {
            throw new Error('Underspecified whereBetween query');
          } else if (typeof o[whereQuery][0] === 'undefined') {
            return queryChain.where(whereQuery, '<', o[whereQuery][1]);
          } else if (typeof o[whereQuery][1] === 'undefined') {
            return queryChain.where(whereQuery, '>', o[whereQuery][0]);
          } else {
            return queryChain.whereBetween(whereQuery, o[whereQuery]);
          }
        }, q),
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
