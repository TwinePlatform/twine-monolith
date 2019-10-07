import _axios from 'axios';
import qs from 'qs';
import getEnvVars from '../../environment'; // eslint-disable-line
// NB pevious file local only

// TODO: change version to v1.1 when server changes have been updated
const baseURL = `${getEnvVars().apiBaseUrl}/v1`;


export const axios = _axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
});

export const CommunityBusinesses = {

  getVolunteerActivities: () => axios.get('/volunteer-activities'),
};
