
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import VolunteerHome from './VolunteerHome';
import Time from './Time';
import { ColoursEnum } from '../../lib/ui/colours';
import AddTime from './AddTime';
import { FontsEnum } from '../../lib/ui/typography';

const getIconName = (name: string) => {
  switch (name) {
    case 'Time':
      return { name: 'clock-fast', size: 25 };
    case 'AddTime':
      return { name: 'plus-box-outline', size: 35 };
    case 'Home':
    default:
      return { name: 'home-outline', size: 25 };
  }
};

const TabNavigator = createBottomTabNavigator({
  Home: VolunteerHome,
  AddTime,
  Time,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      const iconProps = getIconName(routeName);

      return <MaterialCommunityIcons {...iconProps} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: ColoursEnum.purple,
    inactiveTintColor: ColoursEnum.darkGrey,
    labelStyle: { letterSpacing: 1.02, fontFamily: FontsEnum.regular },
  },
});

export default createAppContainer(TabNavigator);
