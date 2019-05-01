import { useEffect, useState } from 'react';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Response } from '../response';

export default (apiCall: AxiosPromise) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data: AxiosResponse = await apiCall;
        setData(Response.get(data));
      } catch (error) {
        setError(Response.errorMessage(error));
      }
      setLoading(false);
    })();
  }, []);
  return { error, loading, data };
};
