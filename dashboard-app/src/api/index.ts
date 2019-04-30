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
  getLogs: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.get('/community-businesses/me/volunteer-logs', { params }),
};
