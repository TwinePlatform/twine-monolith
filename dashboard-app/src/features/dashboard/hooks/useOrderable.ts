/*
 * useOrderable Hook
 *
 * Handles state for modeling orderable tables, storing
 * both the selected order and the "column" that is to
 * be sorted by.
 *
 * Models the following behaviour:
 * 1. Uses input values to set initial state
 * 2. Toggles sort order if "column" value equals existing
 * 3. Sets sort order to "asc" for the "first" column (i.e. index 0)
 * 4. Otherwise sets sort order to "desc"
 *
 * This behaviour is specific to the requirements on the data tables.
 * If more generic behaviour is desired, some of this could be made
 * configurable.
 */
import { useCallback, useState } from 'react';
import { Order } from 'twine-util/arrays';
import { toggle } from 'twine-util/misc';


export type Orderable = {
  sortByIndex: number
  order: Order
};

type Output = {
  orderable: Orderable
  onChangeOrderable: (x: number) => void
};

type InitialValues = {
  initialOrderable: Orderable
  updateOn?: any[]
};

export const toggleOrder = toggle<Order>('asc', 'desc');

export const useOrderable = ({ initialOrderable, updateOn = [] }: InitialValues): Output => {
  const [sortByIndex, setSortByIndex] = useState<number>(initialOrderable.sortByIndex);
  const [order, setOrder] = useState<Order>(initialOrderable.order);

  const onChangeOrderable = useCallback((idx: number) => {
    if (idx > -1) {
      if (idx === sortByIndex) {
        setOrder((prev) => toggleOrder(prev));
      } else if (idx === 0) {
        setOrder('asc');
      } else {
        setOrder('desc');
      }
      setSortByIndex(idx);
    }
  }, [...updateOn, sortByIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orderable: { sortByIndex, order },
    onChangeOrderable,
  };
};
