import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';

//For Expo PushNotification
import { Vibration, Platform } from 'react-native';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  flexDirection: column;
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
  paddingLeft: 40;
  paddingRight: 40;
  flex: 1;
`;

const Heading = styled(H)`
  flexGrow: 0;
`;

const Container = styled.View`
  width: 100%;
  flexGrow: 1;
  justifyContent: space-between;
`;

/*
 * Component
 */

// ToDo: get volunteer id from redux store/api 


// const _handleNotification = { notification } => {
//   Vibration.vibrate();
//   setnotification({ notification: { notification } });
// };

const registerForPushNotificationsAsync = async () => {

  const [expoPushToken, setexpoPushToken] = useState('');
  const [notification, setnotification] = useState<any>();

  const _handleNotification = (notification) => {
    Vibration.vibrate();
    setnotification({ notification: { notification } });
  };

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    _notificationSubscription = Notifications.addListener(_handleNotification);
  }, []);

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    console.log(finalStatus);
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    setexpoPushToken(token);
    console.log('got the token in volunteer!');
    // ToDo: Send api to edit the token with (volunteer.id, token)
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

const VolunteerHome: FC<Props> = () => {
  registerForPushNotificationsAsync();

  return (

    <View>
      <Heading>My Stats</Heading>
      <Container>
        <Stat
          heading="TOTAL TIME GIVEN"
          value="109"
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="TIMES VOLUNTEERED"
          value="42"
          unit="visits"
        >
          <MaterialCommunityIcons name="calendar-blank" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="AVERAGE DURATION"
          value="120"
          unit="minutes"
        >
          <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
      </Container>

    </View>
  )

};

export default VolunteerHome;
