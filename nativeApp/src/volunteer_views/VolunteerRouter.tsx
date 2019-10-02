
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import VolunteerHome from './screens/VolunteerHome';
import Time from './screens/Time';
import Settings from './screens/Settings';
import { ColoursEnum } from '../lib/ui/colours';

const TabNavigator = createBottomTabNavigator({
  Home: VolunteerHome,
  Time: Time,
  Settings: Settings,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({tintColor }) => { //eslint-disable-line
      const { routeName } = navigation.state;
      const IconComponent = MaterialCommunityIcons;
      let iconName;
      if (routeName === 'Home') {
        iconName = "home-outline";
      } else if (routeName === 'Time') {
        iconName = `clock-fast`;
      } else if (routeName === 'Settings') {
        iconName = `settings-outline`;
      }

      // You can return any component that you like here!
      return <IconComponent name={iconName} size={30} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: ColoursEnum.purple,
    inactiveTintColor: ColoursEnum.darkGrey,
  },
});

export default createAppContainer(TabNavigator);
