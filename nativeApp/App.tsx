import React, { Component } from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as Font from 'expo-font';

import Login from './src/shared_views/screens/Login'
import Register from './src/shared_views/screens/Register'

import VolunteerRouter from './src/volunteer_views/VolunteerRouter'


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
      'roboto-light': require('./assets/Roboto-Light.ttf'),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    return this.state.fontLoaded
      ? <AppContainer />
      : <Text>Loading...</Text>
  }
}
 