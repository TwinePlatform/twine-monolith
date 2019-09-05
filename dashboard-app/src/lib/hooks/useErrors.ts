/*
 * useErrors
 *
 * Specific use case (used in dashboard pages):
 * - Automatically handle API errors via arguments
 * - Allow setting other arbitrary error state values via state-setter
 */
import { Dispatch, SetStateAction, useEffect } from 'react';
import { AxiosError } from 'axios';
import { AggregatedData } from '../../features/dashboard/dataManipulation/logsToAggregatedData';
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
  }, [error, setErrors]);

  return [errors, setErrors] as [Dictionary<string>, Dispatch<SetStateAction<Dictionary<string>>>];
};
