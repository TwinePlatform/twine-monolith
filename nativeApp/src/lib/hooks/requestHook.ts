import { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';

const useRequest = (axiosRequest: (x) => Promise<AxiosResponse>, payload?) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    (
      async function () {
        try {
          const { data: res } = await axiosRequest(payload);
          setData(res.result);
        } catch (err) {
          setError(err);
        }
      }()
    );
  }, []);

  return [data, error];
};

export default useRequest;
