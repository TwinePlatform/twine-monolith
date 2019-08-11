import { AxiosResponse } from 'axios';
import { Dictionary, pathOr } from 'ramda';

export const Response = {
  get: <T = Dictionary<any>>(res: AxiosResponse, path: string[] = []): T | null =>
    pathOr(null, ['data', 'result', ...path], res),

  status: (res: AxiosResponse): number | null =>
    pathOr(null, ['status'], res),

  statusEquals: (res: AxiosResponse, status: number) =>
    Response.status(res) === status,

  validationError: (res: AxiosResponse): Dictionary<string> =>
    pathOr({}, ['data', 'error', 'validation'], res),

  isError: (res: AxiosResponse) =>
    res.status >= 400,

  errorMessage: (res: AxiosResponse): string | undefined =>
    pathOr(undefined, ['data', 'error', 'message'], res),
};
