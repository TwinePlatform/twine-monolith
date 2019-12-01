/*
 * This hook is used to contain the complexity of maintaining
 * two data-sets in memory in order to switch between them.
 *
 * This functionality was originally attempted with a simple
 * ternary statement, but this caused a render loop and
 * inconsistent states (for reasons that are not totally
 * understood).
 *
 * Instead, both data sets (left / right) are kept in separate
 * state fragments, as is the "actual" (i.e. currently selected)
 * data-set.
 */
import { useState, useCallback, useEffect } from 'react';

type Arguments<T, U> = {
  initState: T,
  initSide: U,
  left: U,
  right: U
};

export default <T, U> ({ initSide, initState, left: leftSide, right: rightSide }: Arguments<T, U>) => {
  const [left, setLeft] = useState<T>(initState);
  const [right, setRight] = useState<T>(initState);
  const [actual, setActual] = useState<T>(initState);
  const [active, setActive] = useState<(typeof leftSide) | (typeof rightSide)>(initSide);

  const setData = useCallback((x: T | ((y: T) => T)) => {
    if (active === leftSide) {
      setLeft(x);
    } else {
      setRight(x);
    }
  }, [active, leftSide]);

  useEffect(() => {
    if (active === leftSide) {
      setActual(left);
    } else {
      setActual(right);
    }
  }, [active, left, leftSide, right]);

  return {
    active,
    actual,
    setActive,
    setActual: setData,
  };
};
