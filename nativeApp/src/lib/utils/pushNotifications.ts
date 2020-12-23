import AsyncStorage from '@react-native-community/async-storage';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { StorageValuesEnum } from '../../authentication/types';
import { Platform } from 'react-native';
import API from '../../api';

export const registerForPushNotificationsAsync = async () => {
    const userId = await AsyncStorage.getItem(StorageValuesEnum.USER_ID);

    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const pushtoken = await Notifications.getExpoPushTokenAsync();
      API.Users.pushtoken(parseInt(userId), pushtoken);

    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };