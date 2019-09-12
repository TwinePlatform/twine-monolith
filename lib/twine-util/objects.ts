/*
 * Utilities for objects
 */
import { has, assoc, pick, Dictionary } from 'ramda';


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
  (map: Dictionary<string>) => <T>(o: Dictionary<T>) =>
    Object.keys(o).reduce((acc, k) => assoc(map[k] || k, o[k], acc), {} as Dictionary<T>);

export const evolveKeys = <T>(map: Dictionary<((a: string) => string)>, o: Dictionary<T>) =>
  Object.keys(o)
    .reduce((acc, k) =>
      assoc(
        has(k, map) ? map[k](k) : k,
        o[k],
        acc
      ),
    {} as Dictionary<T>);


export const pickOrAll = (xs: string[] | undefined, o: object) => xs ? pick(xs, o) : { ...o };
