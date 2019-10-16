import React, { Component } from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { setCustomText } from 'react-native-global-props';

import * as Font from 'expo-font';

import Login from './src/screens/open_views/Login';
import Register from './src/screens/open_views/Register';

import VolunteerRouter from './src/screens/volunteer_views/VolunteerRouter';
import { FontsEnum } from './src/lib/ui/typography';
import { ColoursEnum } from './src/lib/ui/colours';
import AdminRouter from './src/screens/admin_views/AdminRouter';
import SettingsButton from './src/lib/ui/SettingsButton';
import Settings from './src/screens/shared_views/Settings';
import AdminAddProject from './src/screens/admin_views/Projects/AddProject';
import AdminEditProject from './src/screens/admin_views/Projects/EditProject';
import AdminEditTime from './src/screens/admin_views/AdminTime/EditTime';
import AdminEditVolunteer from './src/screens/admin_views/Volunteers/EditVolunteer';
import AdminAddVolunteer from './src/screens/admin_views/Volunteers/AddVolunteer';


const getSettingsButton = (navigation) => {
  const { routeName } = navigation.state;
  if (['Login', 'Register', 'ForgotPassword'].includes(routeName)) {
    return <></>;
  }
  return <SettingsButton />;
};

const additionalAdminPages = {
  AdminAddProject,
  AdminEditProject,
  AdminEditTime,
  AdminEditVolunteer,
  AdminAddVolunteer,
};

const RootStack = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    Register: {
      screen: Register,
    },
    VolunteerRouter: {
      screen: VolunteerRouter,
    },
    AdminRouter: {
      screen: AdminRouter,
    },
    Settings: {
      screen: Settings,
    },
    ...additionalAdminPages,
  },
  {

    initialRouteName: 'Login',
    defaultNavigationOptions: ({ navigation }) => ({
      headerRight: getSettingsButton(navigation),
      headerBackTitle: 'Back',
      title: 'TWINE',
      headerStyle: {
        backgroundColor: ColoursEnum.purple,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        letterSpacing: 8,
        fontWeight: '300',
        fontFamily: FontsEnum.light,
      },
    }),
  },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  state = {
    fontLoaded: false,
  };

/* eslint-disable */
  async componentDidMount() {
    await Font.loadAsync({
      'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
    });

    this.setState({ fontLoaded: true });
    this.defaultFonts();
  }

  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: FontsEnum.light,
      },
    };
    setCustomText(customTextProps);
  }
  /* eslint-enable */

  render() {
    const { fontLoaded } = this.state;
    return fontLoaded
      ? <AppContainer />
      : <Text>Loading...</Text>;
  }
}
