
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import VolunteerHome from './VolunteerHome';
import Time from './Time';
import Settings from './Settings';
import { ColoursEnum } from '../../lib/ui/colours';

const getIconName = (name: string) => {
  switch (name) {
    case 'Time':
      return 'clock-fast';
    case 'Settings':
      return 'settings-outline';
    case 'Home':
    default:
      return 'home-outline';
  }
};

const TabNavigator = createBottomTabNavigator({
  Home: VolunteerHome,
  Time,
  Settings,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      const iconName = getIconName(routeName);

      return <MaterialCommunityIcons name={iconName} size={30} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: ColoursEnum.purple,
    inactiveTintColor: ColoursEnum.darkGrey,
  },
});

export default createAppContainer(TabNavigator);
