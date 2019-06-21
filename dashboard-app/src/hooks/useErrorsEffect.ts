import { Dispatch, SetStateAction, useEffect } from 'react';
import { AxiosError } from 'axios';
import { AggregatedData } from '../dashboard/dataManipulation/logsToAggregatedData';
import { Dictionary } from 'ramda';

export const useErrorsEffect = (
  error: AxiosError | undefined,
  data: AggregatedData | undefined,
  setErrors: Dispatch<SetStateAction<Dictionary<string>>>) => {
  // set errors on response error
  useEffect(() => {
    if (error) {
      setErrors({ data: error.message });
    }
  }, [error]);

  // clear all errors on response success
  useEffect(() => {
    setErrors({});
  }, [data]);
};
