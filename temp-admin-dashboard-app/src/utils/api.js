import _axios from 'axios';
import { RoleEnum } from './enums'

const baseURL = process.env && process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000/v1'
  : 'https://twine-api-staging.herokuapp.com/v1'

const axios = _axios.create({
  baseURL,
  withCredentials: true,
});

export const api = {
  login: ({ email, password }) => {
    return axios.post('/users/login', { email, password, restrict: RoleEnum.TwineAdmin })
  },
  forgot: ({ email }) => {
    return axios.post('/users/password/forgot', { email, redirect: 'ADMIN_APP' })
  },
  reset: ({ token, email, password, passwordConfirm }) => {
    return axios.post('/users/password/reset', { token, email, password, passwordConfirm })
  },
  adminCodes: () => {
    return axios.get('/community-businesses?fields[]=name&fields[]=adminCode')
  },
  organisations: () => {
    return axios.get('/community-businesses')
  },
  organisation: (id) => {
    return axios.get(`/community-businesses/${id}?`
      + 'fields[]=id&'
      + 'fields[]=name&'
      + 'fields[]=_360GivingId&'
      + 'fields[]=region&'
      + 'fields[]=sector&'
      + 'fields[]=address1&'
      + 'fields[]=address2&'
      + 'fields[]=postCode&'
      + 'fields[]=turnoverBand&'
      + 'fields[]=frontlineApiKey&'
      + 'fields[]=frontlineWorkspaceId')
  },

  updateOrganisation: ({ id, formUpdate }) => {
    return axios.put(`/community-businesses/${id}`, formUpdate)
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