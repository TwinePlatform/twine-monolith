import { useState, useEffect } from 'react';

const useRequest = (axiosRequest: (x) => Promise<{result: any}>, payload?) => {
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
