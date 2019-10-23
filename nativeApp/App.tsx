import React, { Component } from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { setCustomText } from 'react-native-global-props';
import * as Font from 'expo-font';

import { FontsEnum } from './src/lib/ui/typography';
import RootStack from './src/Router';

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
