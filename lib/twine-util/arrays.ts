import { assoc, identity, descend, ascend, sortWith, Dictionary } from 'ramda';


/**
 * Types
 */
export type Order = 'desc' | 'asc';
export type SortCriterion = { accessor?: (<T, U>(a: T) => U), order: Order };


const getSorter = (o: Order) => {
  switch (o) {
    case 'asc':
      return ascend;
    case 'desc':
    default:
      return descend;
  }
};

export const sort = <T>(specs: SortCriterion[], data: T[]) => {
  const s = specs.map(({ accessor = identity, order }) => {
    const sorter = getSorter(order);
    return sorter(accessor);
  });

  return sortWith(s, data);
};

export const innerJoin = <T, U>(as: T[], bs: U[], pred: (a: T, b: U) => boolean) => {
  const x: (T & U)[] = [];

  for (let i = 0; i < as.length; i++) {
    const a = as[i];

    for (let j = 0; j < bs.length; j++) {
      const b = bs[j];

      if (pred(a, b)) {
        x.push({ ...a, ...b });
      }
    }
  }

  return x;
};

export const collectBy = <T>(fn: (a: T) => string, xs: T[]) =>
  xs.reduce((acc, x) =>
    assoc(fn(x), acc.hasOwnProperty(fn(x)) ? acc[fn(x)].concat(x) : [x], acc),
    {} as Dictionary<T[]>
  );
