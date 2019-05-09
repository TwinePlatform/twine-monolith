import { useEffect, useState } from 'react';
import { AxiosPromise, AxiosResponse, AxiosRequestConfig } from 'axios';
import { Dictionary } from 'ramda';
import { Response } from '../util/response';
import { redirectOnError } from '../util/routing';

type RequestParams = {
  apiCall: (params?: Pick<AxiosRequestConfig, 'params'>) => AxiosPromise
  params?: any
  updateOn?: any[]
  callback?: (d: any) => void
  setErrors: (d: any) => void
  push: any
};

interface OnError {
  (error: any,
    setErrors: (d: Dictionary<string>) => void ,
    push: (p: string) => void
    ): void;
}

const onError: OnError = (error, setErrors, push) => {
  const res = error.response;
  if (Response.statusEquals(res, 400)) {
    setErrors(Response.validationError(res));
  } else {
    redirectOnError(push, error);
  }
};

export default ({
  apiCall,
  params = {},
  updateOn = [],
  callback,
  setErrors,
  push,
}: RequestParams) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res: AxiosResponse = await apiCall(params);
        setData(Response.get(res));
        if (callback) {
          callback(Response.get(res));
        }
      } catch (error) {
        onError(error, setErrors, push);
      }
      setLoading(false);
    })();
  }, updateOn);
  return { loading, data };
};
