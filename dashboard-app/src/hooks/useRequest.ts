import { DependencyList } from 'react';
import { useAsyncFn } from 'react-use';
import { AxiosRequestConfig } from 'axios';
import { axios } from '../api';


export type UseRequestParams = {
  config: AxiosRequestConfig
  updateOn: DependencyList
};


const useRequest = ({ config, updateOn }: UseRequestParams) => {
  return useAsyncFn(() => axios(config), updateOn);
};

export default useRequest;
