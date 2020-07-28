import _axios, { AxiosRequestConfig, Method } from 'axios';
import { Api } from '../../../../api/src/api/v1/types/api';
import qs from 'qs';

const baseURL = process.env.REACT_APP_API_HOST_DOMAIN ?
  `${process.env.REACT_APP_API_HOST_DOMAIN}/v1`
  : '/v1';

export const axios = _axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
});

const axios2 = _axios.create({
  baseURL,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  transformResponse: (r) => {
    const res = JSON.parse(r);

    return res.error ? res : res.result;
  },
});

const makeRequest = async <T = any>(params: AxiosRequestConfig) => {
  let headers;
  try {
    const token = "0c0a32c9-5167-44a7-97a1-b56884f91c36";
    headers = { Authorization: token };
  } catch (error) {
    headers = {};
  }
  return axios2.request<T>({ headers, ...params });
};
/*
export const Roles = {
  get: () => makeRequest({ method: "GET", url: "/users/me/roles" }),
};
*/
export const Roles = {
  get: () => axios.get('/users/me/roles'),
};


export const CbAdmins = {
  get: () => {
    axios.get<Api.CommunityBusinesses.CbAdmins.GET.Result>('/community-businesses/me/cb-admins')
      .then((res) => {
        const x = res.data;
      });
  },
  login: ({ email, password }: { email: string, password: string }) =>
    axios.post(
      '/users/login',
      { email, password, type: 'cookie', restrict: ['CB_ADMIN', 'VOLUNTEER_ADMIN'] }
    ),

  logout: () => axios.get('/users/logout'),

  forgotPassword: ({ email }: { email: string }) =>
    axios.post('/users/password/forgot', { email, redirect: 'DASHBOARD_APP' }),

  resetPassword: (payload: { email: string, password: string, passwordConfirm: string, token: string }) =>
    axios.post('/users/password/reset', payload),

};

export const CommunityBusinesses = {
  configs: {
    get: { method: 'GET' as Method, url: '/community-businesses/me' },
    getLogs: { method: 'GET' as Method, url: '/community-businesses/me/volunteer-logs' },
    getVolunteerActivities: { method: 'GET' as Method, url: '/volunteer-activities' },
    getVolunteers: { method: 'GET' as Method, url: '/community-businesses/me/volunteers' },
  },

  get: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.request<Api.CommunityBusinesses.Me.GET.Result>({ ...CommunityBusinesses.configs.get, params }),
  getLogs: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.request({ ...CommunityBusinesses.configs.getLogs, params }),
  getVolunteerActivities: () =>
    axios({ ...CommunityBusinesses.configs.getVolunteerActivities }),
  getVolunteers: () => // NB: fields not currently supported
    axios({ ...CommunityBusinesses.configs.getVolunteers, params: { fields: ['name', 'id'] } }),
};
