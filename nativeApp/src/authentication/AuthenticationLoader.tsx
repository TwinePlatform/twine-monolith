import React, { useEffect, FC } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch } from 'react-redux';
import API from '../api';
import { updateCurrentUser } from '../redux/currentUser';

const AuthenticationLoader: FC<NavigationInjectedProps> = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.Authentication.roles();
        dispatch(updateCurrentUser(data));
        // TODO get role types from api
        if (data.roles.includes('CB_ADMIN') || data.roles.includes('VOLUNTEER_ADMIN')) {
          props.navigation.navigate('AdminStack');
        } else if (data.roles.includes('VOLUNTEER')) {
          props.navigation.navigate('VolunteerStack');
        } else {
          throw new Error('unsupported role');
        }
      } catch (error) {
        console.log({ error });
        props.navigation.navigate('AuthStack');
        //props.navigation.navigate('AdminStack');
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
