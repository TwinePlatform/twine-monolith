import { Dispatch, SetStateAction, useEffect } from 'react';
import { AxiosError } from 'axios';
import { AggregatedData } from '../dashboard/dataManipulation/logsToAggregatedData';
import { Dictionary } from 'ramda';
import { useResettableState } from './useResettableState';

export const useErrors = (
  error: AxiosError | undefined,
  data: AggregatedData | undefined) => {

  const [errors, setErrors] = useResettableState<Dictionary<string>>({}, [data]);

  // set errors on response error
  useEffect(() => {
    if (error) {
      setErrors({ data: error.message });
    }
  }, [error]);

  return [errors, setErrors] as [Dictionary<string>, Dispatch<SetStateAction<Dictionary<string>>>];
};
