import { DependencyList } from 'react';
import { useAsyncFn } from 'react-use';
import { AxiosRequestConfig } from 'axios';
import { axios } from '../api';
import { Dictionary } from 'ramda';


export type UseRequestParams = {
  config: AxiosRequestConfig
  params: Dictionary<string | number>
  updateOn: DependencyList
};


const useRequest = ({ config, updateOn }: UseRequestParams) => {
  return useAsyncFn(() => axios(config), updateOn);
};

export default useRequest;
