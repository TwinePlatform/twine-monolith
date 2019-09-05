/*
 * useBatchRequest
 *
 * Note that this hook causes the requests to be made immediately.
 * If deferred execution of requests is required, create a new hook:
 * `useBatchRequestDeferred` which returns not only the state but a
 * function which is used to trigger the request. `useEffect` will
 * then be replaced by `useCallback`.
 *
 * See https://github.com/streamich/react-use/blob/master/src/useAsyncFn.ts
 */
import { useState, DependencyList, useEffect } from 'react';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { evolve } from 'ramda';
import { axios } from '../api';


export type UseBatchRequestParams = {
  requests: AxiosRequestConfig[]
  updateOn?: DependencyList
};

type State = {
  loading: boolean
  results: any[]
  error?: AxiosError
};

const initialState = {
  loading: true,
  results: [],
};

const castToArray = <T>(a?: T | T[]) =>
  Array.isArray(a)
    ? a
    : a
      ? [a]
      : [];

const responseTransformers = castToArray(axios.defaults.transformResponse);
const augmentTransformers = evolve({
  transformResponse: (tr) => tr ? responseTransformers.concat(tr) : undefined,
});

export default (args: UseBatchRequestParams) => {
  const { requests, updateOn = [] } = args;

  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    Promise.all(requests.map(augmentTransformers).map((req) => axios(req)))
      .then((results) => {
        setState({ loading: false, results });
      })
      .catch((error) => {
        setState({ loading: false, results: [], error });
      });
  }, updateOn); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};
