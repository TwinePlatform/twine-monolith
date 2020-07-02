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
