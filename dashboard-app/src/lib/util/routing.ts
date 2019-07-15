import qs from 'querystring';
import { AxiosError } from 'axios';
import { Dictionary } from 'ramda';
import { RouteComponentProps } from 'react-router-dom';
import { Response } from './response';


export const DEFAULT_REDIRECTS = {
  400: '/error/400',
  401: '/login',
  403: '/login',
  404: '/error/404',
  500: '/error/500',
  default: '/error/unknown',
};

export const getUrlFromStatusCode = (code: number, map: Dictionary<string>) => {
  const redirs = Object.assign(DEFAULT_REDIRECTS, map);

  return redirs.hasOwnProperty(code)
    ? redirs[code]
    : redirs['default'];
};


/**
 * Utility function to support client-side redirects based on
 * common status codes
 *
 * Allows passing custom redirects to override defaults
 */
export const redirectOnError = (
  historyPush: (s: string) => void,
  error: AxiosError,
  custom: Dictionary<string> = {}
) => {
  const redirs = { ...DEFAULT_REDIRECTS, ...custom };
  const res = error.response;
  const url = !res
    ? redirs.default
    : getUrlFromStatusCode(Response.status(res), redirs);

  return historyPush(url);
};


export const getQueryObjectFromProps = <T extends RouteComponentProps>(props: T) =>
  qs.parse(props.location.search.replace('?', ''));

export const withParams = (path: string, params: Dictionary<string>) =>
  `${path}?${qs.stringify(params)}`;
