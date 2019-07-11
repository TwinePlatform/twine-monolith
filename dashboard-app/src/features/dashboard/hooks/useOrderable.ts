import { useCallback, useState } from 'react';
import { Order } from 'twine-util/arrays';
import { toggleOrder } from '../util';

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
  }, [...updateOn, sortByIndex, order]);

  return {
    orderable: { sortByIndex, order },
    onChangeOrderable,
  };
};
