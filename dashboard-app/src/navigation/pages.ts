import React from 'react';
import { matchPath } from 'react-router';
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
    title: 'Home',
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

const NavBarOrder = [
  'Home',
  'Time',
  'Activity',
  'Volunteer'
];


export const Pages = {
  matchPath (pathname: string) {
    const match = Object.values(PagesDict)
      .map(({ url }) => matchPath(pathname, { path: url, exact: true }))
      .filter(Boolean)
      [0];

    if (match === null || match === undefined) {
      return null;
    }

    const pages = filter((page) => page.url === match.path, PagesDict);
    const keys = Object.keys(pages);

    if (keys.length !== 1) {
      return null;
    }

    return pages[keys[0]];
  },

  getNavbarLinks () {
    return Pages.getProtected()
      .sort((a, b) => NavBarOrder.indexOf(a.title) - NavBarOrder.indexOf(b.title));
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

  navigateTo (s: keyof PagesDictionary, push: (path: string) => void) {
    if (PagesDict.hasOwnProperty(s)) {
      push(PagesDict[s].url);
    }
  },
};
