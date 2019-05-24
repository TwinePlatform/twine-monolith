/*
 * Utilities for objects
 */
import { curry, assoc, pick, Dictionary } from 'ramda';

export const reduceKeys =
  <T>(f: (a: T, k: string) => T, init: T, o: Dictionary<any>) =>
    Object.keys(o).reduce((acc, key) => f(acc, key), init);

export const reduceValues =
  <T, K>(f: (a: T, v: K) => T, init: T, o: Dictionary<K>) =>
    Object.keys(o).reduce((acc, key) => f(acc, o[key]), init);

export const mapKeys =
  (f: (s: string) => string) => <T>(o: Dictionary<T>) =>
    Object.keys(o).reduce((acc, k) => assoc(f(k), o[k], acc), {} as Dictionary<T>);

export const mapValues =
  <T, U>(f: (s: T) => U, o: Dictionary<T>) =>
      Object.keys(o).reduce((acc, k) => assoc(k, f(o[k]), acc), {} as Dictionary<U>);

export const renameKeys =
  (map: Dictionary<string>) => (o: Dictionary<any>) =>
    Object.keys(o)
      .reduce((acc, k) => assoc(map[k] || k, o[k], acc), {} as Dictionary<any>);

export const evolveKeys = <T>(map: Dictionary<any>, o: Dictionary<T>) =>
  Object.keys(o)
    .reduce((acc, k) =>
      assoc(
        map.hasOwnProperty(k) ? map[k](k) : k,
        o[k],
        acc
      ),
    {} as Dictionary<T>);


export const pickOrAll = curry(
  (xs: string[] | undefined, o: object) => xs ? pick(xs, o) : { ...o });

export const sumValues = (o: Dictionary<any>) =>
  reduceValues((acc, val) => acc + (isNaN(val) ? 0 : Number(val)), 0, o)
