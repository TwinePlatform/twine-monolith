import _axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { pathOr, Dictionary } from 'ramda';
import qs from 'qs';

const baseURL = process.env.REACT_APP_API_HOST_DOMAIN ?
  `${process.env.REACT_APP_API_HOST_DOMAIN}/v1`
  : '/v1';

export const axios = _axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
});


export const Roles = {
  get: () => axios.get('/users/me/roles'),
};

export const CbAdmins = {
  login: ({ email, password }: { email: string, password: string }) =>
    axios.post(
      '/users/login',
      { email, password, type: 'cookie', restrict: ['CB_ADMIN', 'VOLUNTEER_ADMIN'] }
    ),

  logout: () => axios.get('/users/logout'),

  forgotPassword: ({ email }: { email: string }) =>
    axios.post('/users/password/forgot', { email, redirect: 'DASHBOARD_APP' }),

  // tslint:disable-next-line:max-line-length
  resetPassword: (payload: { email: string, password: string, passwordConfirm: string, token: string }) =>
    axios.post('/users/password/reset', payload),

};

export const CommunityBusinesses = {
  get: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.get('/community-businesses/me', { params }),
};


export const Response = {
  get: <T = Dictionary<any>>(res: AxiosResponse, path: string[] = []): T =>
    pathOr(null, ['data', 'result', ...path], res),

  status: (res: AxiosResponse): number =>
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
