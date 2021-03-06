import _axios, { AxiosRequestConfig, Method } from 'axios';
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
    getVolunteerActivities: { method: 'GET' as Method, url: '/volunteer-activities' },
    getVolunteerProjects: { method: 'GET' as Method, url: '/community-businesses/me/volunteers/projects' },
    getVolunteers: { method: 'GET' as Method, url: '/community-businesses/me/volunteers' },
  },

  get: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.request({ ...CommunityBusinesses.configs.get, params }),
  getLogs: (params?: Pick<AxiosRequestConfig, 'params'>) =>
    axios.request({ ...CommunityBusinesses.configs.getLogs, params }),
  getVolunteerActivities: () =>
    axios({ ...CommunityBusinesses.configs.getVolunteerActivities }),
  getVolunteers: () => // NB: fields not currently supported
    axios({ ...CommunityBusinesses.configs.getVolunteers, params: { fields: ['name', 'id'] } }),
};

export const Logs = {
  add: (values: any) => axios.post( `/community-businesses/me/volunteer-logs`, values),
  update: (userId: any, logId: any, values: any) => axios.put(`/community-businesses/me/volunteer-logs/${userId}/${logId}`,values),
  delete: (LogId: any) => axios.delete( `/community-businesses/me/volunteer-logs/${LogId}`)
}

export const LogNote = {
  get: (logID: string) =>
    axios.get("community-businesses/me/get-volunteer-logs/" + logID),
  update: (note: string, LogId: any, activity: any, project: any, startedAt: any) => axios.put(`community-businesses/me/volunteer-logs-notes/${LogId}`,
      {
        activity: activity,
        startedAt: startedAt,
        notes: note,
        project: project
      }
    )
}

export const Files = {
  upload: async (file: File, orgID: number) => {
    console.log("uploading " + file.name + " to /community-businesses/")
    const formData = new FormData();
    const csvFile = new File ([file],file.name,{type: "text/csv"})

    formData.append('csv', csvFile);

    try{
      const res = await axios.post('upload/CSVlogs/' + orgID, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }});
      return {
        state: "success",
        data: res.data
      }
    }
    catch(error){
      return {
        state: "error",
        data: error
      }
    }
  }
}

export const Project = {
  get: () => axios.get( '/community-businesses/me/volunteers/projects'),
  add: (name: string) => axios.post('/community-businesses/me/volunteers/projects',{name}),
}

export const Users = {
  getMe: () => axios.get( '/users/me'),
}

export const Invite = {
  byEmail: (email: any) => axios.post('/invite/email',{email}),
}