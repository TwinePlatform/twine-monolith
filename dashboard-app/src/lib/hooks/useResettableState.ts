import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export const useResettableState = <T>(init: T, resetOn: any[] = []) => {
  const [state, setState] = useState<T>(init);

  useEffect(() => {
    setState(init);
  }, resetOn);

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
};
