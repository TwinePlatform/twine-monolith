import { useState, useEffect } from 'react';

interface Res { result: any }

const useRequest = <T extends Res, U>(axiosRequest: (q?: U) => Promise<T>, payload?: U) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => () => {
    axiosRequest(payload)
      .then((res) => setData(res.result))
      .catch(setError);
  }, []);

  return [data, error];
};

export default useRequest;
