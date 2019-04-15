/*
 * Utilities for objects
 */
import { curry, assoc, pick, Dictionary } from 'ramda';


export const mapKeys =
    (f: (s: string) => string) => <T>(o: Dictionary<T>) =>
      Object.keys(o).reduce((acc, k) => assoc(f(k), o[k], acc), {} as Dictionary<T>);

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
