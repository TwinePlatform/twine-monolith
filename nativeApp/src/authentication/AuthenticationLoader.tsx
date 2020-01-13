import React, { useEffect, FC } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import API from '../api';

const AuthenticationLoader: FC<NavigationInjectedProps> = (props) => {
  useEffect(() => {
    (async () => {
      try {
        const { data: { roles } } = await API.Authentication.roles();
        // TODO get role types from api
        if (roles.includes('CB_ADMIN') || roles.includes('VOLUNTEER_ADMIN')) {
          props.navigation.navigate('AdminStack');
        } else if (roles.includes('VOLUNTEER')) {
          props.navigation.navigate('VolunteerStack');
        } else {
          throw new Error('unsupported role');
        }
      } catch (error) {
        console.log({ error });
        props.navigation.navigate('AuthStack');
      }
    })();
  });

  return (
    // TODO loading styles
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

export default AuthenticationLoader;
