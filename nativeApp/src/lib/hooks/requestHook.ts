import { useState, useEffect } from 'react';
import { AxiosResponse, AxiosError } from 'axios';


const useRequest = <T extends AxiosResponse<T>, U>
  (axiosRequest: (q?: U) => Promise<T>,
    payload?: U,
    updateOn: any[] = [],
  ): [T, AxiosError] => {
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    axiosRequest(payload)
      .then((res) => setData(res.data))
      .catch(setError);
  }, updateOn);

  return [data, error];
};

export default useRequest;
