import _axios, { AxiosRequestConfig, AxiosError } from 'axios';
import qs from 'qs';
import { AsyncStorage } from 'react-native';
import getEnvVars from '../../environment'; // eslint-disable-line
import { StorageValuesEnum } from '../authentication/types';
import { Api } from '../../../api/src/api/v1/types/api';
// NB pevious file local only

// TODO: change version to v1.1 when server changes have been updated
const baseURL = `${getEnvVars().apiBaseUrl}/v1`;


const axios = _axios.create({
  baseURL,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  transformResponse: (r) => {
    const res = JSON.parse(r);

    return res.error
      ? res
      : res.result;
  },
});

const makeRequest = async <T = any> (params: AxiosRequestConfig) => {
  let headers;
  try {
    const token = await AsyncStorage.getItem(StorageValuesEnum.USER_TOKEN);
    headers = { Authorization: token };
  } catch (error) {
    headers = {};
  }
  return axios.request<T>({ headers, ...params });
};


const Authentication = {
  login: ({ email, password }) => axios.post('/users/login', {
    email,
    password,
    restrict: ['VOLUNTEER', 'VOLUNTEER_ADMIN', 'CB_ADMIN'],
    type: 'body',
  }),
  logOut: () => makeRequest({ method: 'GET', url: 'users/logouts' }),
  roles: () => makeRequest({ method: 'GET', url: '/users/me/roles' }),
};

const Volunteers = {
  get: () => makeRequest<Api.CommunityBusinesses.Id.Volunteers.GET.Result>(
    { method: 'GET', url: '/community-businesses/me/volunteers' },
  ),
  add: (volunteer) => makeRequest<Api.Users.Register.Volunteers.POST.Result>(
    {
      method: 'POST',
      url: '/users/register/volunteers',
      data: { ...volunteer },
    },
  ),
  update: ({ id, ...changeset }) => makeRequest<Api.Users.Volunteers.Id.PUT.Result>(
    { method: 'PUT', url: `/users/volunteers/${id}`, data: changeset },
  ),
  delete: (id: number) => makeRequest<Api.Users.Volunteers.Id.DELETE.Result>(
    { method: 'DELETE', url: `/users/volunteers/${id}` },
  ),
};

const VolunteerLogs = {
  get: (since?: Date, until?: Date) => makeRequest<Api.CommunityBusinesses.Me.VolunteerLogs.GET.Result>( //eslint-disable-line
    {
      method: 'GET',
      url: '/community-businesses/me/volunteer-logs',
      params: { since, until },
    },
  ),
  getVolunteerActivities: () => axios.get('/volunteer-activities'),

};

const API = {
  Authentication,
  Volunteers,
  VolunteerLogs,
};

export default API;

export const getErrorResponse = (res: AxiosError) => {
  try {
    return res.response.data.error;
  } catch (error) {
    console.log(error);
    return res;
  }
};
