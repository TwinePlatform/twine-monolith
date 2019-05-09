import React from 'react';
import { Route } from 'react-router-dom';
import { Dictionary, filter } from 'ramda';
import Dashboard from '../dashboard/Dashboard';
import ByActivity from '../dashboard/ByActivity';
import ByTime from '../dashboard/ByTime';
import ByVolunteer from '../dashboard/ByVolunteer';
import Login from '../auth/pages/Login';
import ResetPassword from '../auth/pages/ResetPassword';
import ForgotPassword from '../auth/pages/ForgotPassword';
import ErrorPage from '../Error';



type Page = {
  url: string
  title: string
  component: React.ComponentClass | React.FunctionComponent
  protected?: boolean
};

type PagesDictionary = Dictionary<Page>;

export const PagesDict: PagesDictionary = {
  Dashboard: {
    url: '/',
    component: Dashboard,
    title: 'Dashboard',
    protected: true,
  },
  Activity: {
    url: '/activity',
    component: ByActivity,
    title: 'Activity',
    protected: true,
  },
  Time: {
    url: '/time',
    component: ByTime,
    title: 'Time',
    protected: true,
  },
  Volunteer: {
    url: '/volunteer',
    component: ByVolunteer,
    title: 'Volunteer',
    protected: true,
  },
  Login: {
    url: '/login',
    component: Login,
    title: 'Login',
  },
  ResetPassword: {
    url: '/password/reset/:token',
    component: ResetPassword,
    title: 'Reset Password',
  },
  ForgotPassword: {
    url: '/password/forgot',
    component: ForgotPassword,
    title: 'Forgot Password',
  },
  ErrorPage: {
    url: '/error/:code',
    component: ErrorPage,
    title: 'Error',
  },
};


const filterBy = (k: keyof Page, v: string) => filter((page) => page[k] === v, PagesDict);


export const Pages = {
  matchPath (pathname: string) {
    const pages = filterBy('url', pathname);
    const keys = Object.keys(pages);

    if (keys.length !== 1) {
      throw new Error(`One page expected, ${keys.length} returned: ${keys}. ${pathname}`);

    }

    return pages[keys[0]];
  },

  getProtected () {
    return Object.values(filter((page) => Boolean(page.protected), PagesDict));
  },

  getPublic () {
    return Object.values(filter((page) => !Boolean(page.protected), PagesDict));
  },

  toDisplay (p: Page) {
    return p.title;
  },
};
