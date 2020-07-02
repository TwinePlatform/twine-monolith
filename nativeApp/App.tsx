import React, { Component } from 'react';
import { Text } from 'react-native';
import { createAppContainer, NavigationInjectedProps } from 'react-navigation';
import { setCustomText } from 'react-native-global-props';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// import logger from 'redux-logger';
import thunk from 'redux-thunk';
import * as Font from 'expo-font';

import { FontsEnum } from './src/lib/ui/typography';
import RootStack from './src/Router';
import reducer from './src/redux/rootReducer';

const AppContainer = createAppContainer(RootStack);
const store = createStore(reducer, applyMiddleware(thunk));

export default class App extends Component<NavigationInjectedProp>{
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      /* eslint-disable */
      'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
      'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
      'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      /* eslint-enable */
    });

    this.setState({ fontLoaded: true });
    this.defaultFonts();
  }

  defaultFonts = () => {
    const customTextProps = {
      style: {
        fontFamily: FontsEnum.light,
      },
    };
    setCustomText(customTextProps);
  }

  render() {
    const { fontLoaded } = this.state;

    if (!fontLoaded) {
      return <Text>Loading...</Text>;
    }

    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
