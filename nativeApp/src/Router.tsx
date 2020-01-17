import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { FontsEnum } from './lib/ui/typography';
import { ColoursEnum } from './lib/ui/colours';

import Login from './screens/open_views/Login';
import Register from './screens/open_views/Register';

import VolunteerRouter from './screens/volunteer_views/VolunteerRouter';
import AdminRouter from './screens/admin_views/AdminRouter';
import SettingsButton from './lib/ui/SettingsButton';
import SettingsPage from './screens/settings_views/SettingsPage/index';
import AdminEditTime from './screens/admin_views/Time/EditTime';
import AdminEditVolunteer from './screens/admin_views/Volunteers/EditVolunteer';
import AdminAddVolunteer from './screens/admin_views/Volunteers/AddVolunteer';
import AdminAddProject from './screens/admin_views/Projects/AddProject';
import AuthenticationLoader from './authentication/AuthenticationLoader';
import Profile from './screens/settings_views/Profile';

const additionalAdminPages = {
  AdminEditTime,
  AdminEditVolunteer,
  AdminAddVolunteer,
  AdminAddProject,
};

const sharedNavigationsConfig = {
  headerBackTitle: 'Back',
  title: 'TWINE',
  headerStyle: {
    backgroundColor: ColoursEnum.purple,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    letterSpacing: 2,
    fontWeight: '300' as '300',
    fontFamily: FontsEnum.medium,
  },
};

const Settings = {
  SettingsPage,
  Profile,
};

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    Register: {
      screen: Register,
    },
  },
  {
    defaultNavigationOptions: sharedNavigationsConfig,
  },
);

const AdminStack = createStackNavigator({
  AdminRouter: {
    screen: AdminRouter,
  },
  ...Settings,
  ...additionalAdminPages,
},
{
  defaultNavigationOptions: {
    ...sharedNavigationsConfig,
    headerRight: <SettingsButton />,
  },
});

const VolunteerStack = createStackNavigator({
  VolunteerRouter: {
    screen: VolunteerRouter,
  },
  ...Settings,
},
{
  defaultNavigationOptions: {
    ...sharedNavigationsConfig,
    headerRight: <SettingsButton />,
  },
});

const RootStack = createSwitchNavigator(
  {
    AuthStack,
    AuthenticationLoader,
    AdminStack,
    VolunteerStack,
  },
  {

    initialRouteName: 'AuthenticationLoader',
  },
);

export default RootStack;
