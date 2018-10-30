import _axios from 'axios';
import { RoleEnum } from './enums'
import * as moment from 'moment'

const baseURL = process.env
  ? process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/v1'
    : 'https//:api.twine-together.com/v1'
  : 'https//:api.twine-together.com/v1'

const axios = _axios.create({
  baseURL,
  timeout: 1000,
  withCredentials: true,
});

export const api = {
  login: ({ email, password }) => {
    return axios.post('/users/login', { email, password, restrict: RoleEnum.TwineAdmin })
  },
  adminCodes: () => {
    return axios.get('/community-businesses?fields[]=name&fields[]=adminCode')
  },
  organisations: () => {
    return axios.get('/community-businesses')
  },
  organisation: (id) => {
    return axios.get(`/community-businesses/${id}`)
  },
  visitLogs: () => {
    return axios.get(`/visit-logs`)
  },
  volunteerLogs: () => {
    return axios.get(`/volunteer-logs`)
  },
  regions: () => {
    return axios.get(`/regions`)
  },
  sectors: () => {
    return axios.get(`/sectors`)
  },
};