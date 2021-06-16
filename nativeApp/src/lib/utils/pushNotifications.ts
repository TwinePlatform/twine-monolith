import AsyncStorage from '@react-native-async-storage/async-storage';
import Notification from 'expo-notifications';
import Constants from 'expo-constants';
import { StorageValuesEnum } from '../../authentication/types';
import { Platform } from 'react-native';
import API from '../../api';
import NotificationButton from '../ui/CardWithButtons/NotificationButton';

export const registerForPushNotificationsAsync = async () => {
    const userId = await AsyncStorage.getItem(StorageValuesEnum.USER_ID);

    if (Constants.isDevice) {
      //const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      const { status: existingStatus } = await Notification.requestPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const pushtoken = await Notification.getExpoPushTokenAsync();
      API.Users.pushtoken(parseInt(userId), pushtoken.toString());

    } else {
      alert('Must use physical device for Push Notifications');
    }

    /* doubt this ever worked, but doesn't seem to be an option now
    if (Platform.OS === 'android') {
      Notification.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
    */
  };