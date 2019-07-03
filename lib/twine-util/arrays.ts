import { identity, descend, ascend, sortWith } from 'ramda';


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
