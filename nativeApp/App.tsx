import React, { Component } from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { setCustomText } from 'react-native-global-props';

import * as Font from 'expo-font';

import Login from './src/open_views/screens/Login'
import Register from './src/open_views/screens/Register'

import VolunteerRouter from './src/volunteer_views/VolunteerRouter'
import { Fonts } from './src/lib/ui/typography';


const RootStack = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    Register:  {
      screen: Register,
    },
    VolunteerRouter: {
      screen: VolunteerRouter,
    },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerBackTitle: 'Back',
      title: 'T W I N E',
      headerStyle: {
        backgroundColor: '#8000FF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: '300',
        fontFamily: 'roboto-light'
      },
    },
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  state = {
    fontLoaded: false,
  };

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

  defaultFonts(){
    const customTextProps = {
      style: {
        fontFamily: Fonts.light
      }
    }
    setCustomText(customTextProps)
  }

  render() {
    return this.state.fontLoaded
      ? <AppContainer />
      : <Text>Loading...</Text>
  }
}
 