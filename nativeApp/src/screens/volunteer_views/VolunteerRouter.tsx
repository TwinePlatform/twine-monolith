
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import VolunteerHome from './VolunteerHome';
import Time from './Time';
import Settings from './Settings';
import { ColoursEnum } from '../../lib/ui/colours';
import AddTime from './AddTime';

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
  },
});

export default createAppContainer(TabNavigator);
