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

const today = moment();
const tomorrow = today.clone().add(1, 'day').format('YYYY-MM-DD');
const lastMonth = today.clone().subtract(1, 'month').format('YYYY-MM-DD');

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
    return axios.get(`/visit-logs?since=${lastMonth}&until=${tomorrow}`)
  },
  volunteerLogs: () => {
    return axios.get(`/volunteer-logs?since=${lastMonth}&until=${tomorrow}`)
  },
};