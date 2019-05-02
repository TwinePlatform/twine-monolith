import { useEffect, useState } from 'react';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Response } from '../response';

export default (apiCall: () => AxiosPromise) => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState();
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res: AxiosResponse = await apiCall();
        setData(Response.get(res));
      } catch (error) {
        setError(Response.errorMessage(error));
      }
      setLoading(false);
    })();
  }, [apiCall]);
  return { error, loading, data };
};
