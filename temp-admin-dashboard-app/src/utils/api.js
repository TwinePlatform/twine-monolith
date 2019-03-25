import _axios from 'axios';
import { RoleEnum } from './enums'

const baseURL =
  process.env && process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/v1'
    : 'https://api.twine-together.com/v1';

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
  tempOrganisations: () => {
    return axios.get('/community-businesses/temporary')
  },
  deleteTempOrganisation: (id) => {
    return axios.delete(`/community-businesses/temporary/${id}`)
  },
  getAdmins: (id) => {
    return axios.get(`/community-businesses/${id}/cb-admins`)
  },
  tempAdminPasswordReset: (id) => {
    return axios.get(`/community-businesses/temporary/${id}/password/reset`)
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
  register: ({ formUpdate }) => {
    return axios.post('/community-businesses/register', formUpdate)
  },
  registerTemp: ({ orgName }) => {
    console.log({ orgName });

    return axios.post('/community-businesses/register/temporary', { orgName })
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

export const ResponseUtils = {
  getRes: (res) => res.data.result
}