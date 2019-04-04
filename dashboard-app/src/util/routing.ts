import qs from 'querystring';
import { AxiosError } from 'axios';
import { Dictionary } from 'ramda';
import { RouteComponentProps } from 'react-router-dom';
import { Response } from '../api';

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
  const defaults = {
    400: '/error/400',
    401: '/login',
    403: '/login',
    404: '/error/404',
    500: '/error/500',
    default: '/error/unknown',
  };

  const redirs = { ...defaults, ...custom };
  const res = error.response;

  if (!res) {
    return historyPush(redirs.default);
  }

  if (Response.statusEquals(res, 400)) {
    historyPush(redirs[400]);

  } else if (Response.statusEquals(res, 401)) {
    historyPush(redirs[401]);

  } else if (Response.statusEquals(res, 403)) {
    historyPush(redirs[403]);

  } else if (Response.statusEquals(res, 404)) {
    historyPush(redirs[404]);

  } else if (Response.statusEquals(res, 500)) {
    historyPush(redirs[500]);

  } else {
    historyPush(redirs.default);
  }
};


export const getQueryObjectFromProps = <T extends RouteComponentProps>(props: T) =>
  qs.parse(props.location.search.replace('?', ''));

export const withParams = (path: string, params: Dictionary<string>) =>
  `${path}?${qs.stringify(params)}`;
