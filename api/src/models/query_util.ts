import * as Knex from 'knex';
import { intersection, compose, isNil, Dictionary } from 'ramda';
import { ModelQuery, ModelQueryPartial } from './types/query';

type DateLike = Date | number | undefined;

export const Utils = {
  limit: <T, U>(n: number) => (q: Knex.QueryBuilder<T, U>) => q.limit(n),
  offset: <T, U>(n: number) => (q: Knex.QueryBuilder<T, U>) => q.offset(n),
  order: <T, U>(c: string, d: string) => (q: Knex.QueryBuilder<T, U>) => q.orderBy(c, d),
  where: <T, U>(o: object) => (q: Knex.QueryBuilder<T, U>) => q.where(o),
  whereNot: <T, U>(o: object) => (q: Knex.QueryBuilder<T, U>) => q.whereNot(o),
  whereBetween: <T, U>(o: Dictionary<[DateLike, DateLike]>) =>
    (q: Knex.QueryBuilder<T, U>) =>
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
  <T, U, V>(p: Knex.QueryBuilder<T, U>, opts: ModelQuery<V> | ModelQueryPartial<V>): Knex.QueryBuilder<T, U> => {

    const modifiers = intersection(Object.keys(opts), Object.keys(Utils));

    const query = modifiers
      .reduce((acc, k: keyof ModelQuery<U>) => {
        if (k === 'limit' && !isNil(opts.limit)) {
          return compose(Utils.limit(opts.limit), acc);

        } else if (k === 'offset' && !isNil(opts.offset)) {
          return compose(Utils.offset(opts.offset), acc);

        } else if (k === 'order' && !isNil(opts.order)) {
          const [col, order] = opts.order;
          return compose(Utils.order(String(col), order), acc);

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
      }, () => p);

    return query();
  };
