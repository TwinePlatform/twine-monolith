import { useState, useEffect } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import { Status } from '../../screens/types';

type Options<T, U> = {
  request: (q?: U) => Promise<T>;
  payload?: U;
  updateOn?: any[];
  setStatus?: (Status) => void;
}
const useRequest = <T extends AxiosResponse<T>, U>
  ({
    request,
    payload,
    updateOn = [],
    setStatus = () => {},
  }: Options<T, U>): [T, AxiosError] => {
  setStatus(Status.loading);

  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    request(payload)
      .then((res) => {
        setStatus(Status.successful);
        setData(res.data);
      })
      .catch((e) => {
        setStatus(Status.failed);
        setError(e);
      });
  }, updateOn);

  return [data, error];
};

export default useRequest;
