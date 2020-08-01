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

  resetPassword: (payload: { email: string, password: string, passwordConfirm: string, token: string }) =>
    axios.post('/users/password/reset', payload),

};

export const CommunityBusinesses = {
  configs: {
    get: { method: 'GET' as Method, url: '/community-businesses/me' },
    getLogs: { method: 'GET' as Method, url: '/community-businesses/me/volunteer-logs' },
    getLogFields: {method: 'GET' as Method, url: '/community-businesses/me/volunteer-logs-fields'},
    getVolunteerActivities: { method: 'GET' as Method, url: '/volunteer-activities' },
    getVolunteerProjects: { method: 'GET' as Method, url: '/community-businesses/me/volunteers/projects' },
    getVolunteers: { method: 'GET' as Method, url: '/community-businesses/me/volunteers' },
  },

  get: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.request<Api.CommunityBusinesses.Me.GET.Result>({ ...CommunityBusinesses.configs.get, params }),
  getLogs: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.request({ ...CommunityBusinesses.configs.getLogs, params }),
  getLogFields: () =>
    {return [{id:1, name: "Name"},{id:2, name: "Project"},{id:3, name: "Data"}]},
  getVolunteerActivities: () =>
    axios({ ...CommunityBusinesses.configs.getVolunteerActivities }),
  getVolunteers: () => // NB: fields not currently supported
    axios({ ...CommunityBusinesses.configs.getVolunteers, params: { fields: ['name', 'id'] } }),
};


export const File = {
  upload: (file: File, destination: string) => {
    console.log("uploading " + file.toString() + "to /community-businesses/" + destination )
    /*axios.post('/community-businesses/' + destination, file, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })*/
  }

 
}