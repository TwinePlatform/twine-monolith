import { useEffect, useState } from 'react';
import { AxiosPromise, AxiosResponse, AxiosRequestConfig } from 'axios';
import { Response } from '../response';

type RequestParams = {
  apiCall: (params?: Pick<AxiosRequestConfig, 'params'>) => AxiosPromise
  params?: Pick<AxiosRequestConfig, 'params'>
  updateOn?: any[]
};

export default ({ apiCall, params, updateOn = [] }: RequestParams) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res: AxiosResponse = await apiCall(params);
        setData(Response.get(res));
      } catch (error) {
        setError(Response.errorMessage(error));
      }
      setLoading(false);
    })();
  }, updateOn);
  return { error, loading, data };
};
