
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { ColoursEnum } from '../../lib/ui/colours';
import AdminHome from './AdminHome';
import Projects from './Projects';
import Settings from './Settings';
import Volunteers from './Volunteers';

const getIconName = (name: string) => {
  switch (name) {
    case 'Volunteers':
      return [MaterialIcons, 'person-outline'];
    case 'Projects':
      return [MaterialIcons, 'assignment'];
    case 'Settings':
      return [MaterialCommunityIcons, 'settings-outline'];
    case 'Home':
    default:
      return [MaterialCommunityIcons, 'home-outline'];
  }
};

const TabNavigator = createBottomTabNavigator({
  Home: AdminHome,
  Volunteers,
  Projects,
  Settings,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      const [Icon, iconName] = getIconName(routeName);

      return <Icon name={iconName} size={30} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: ColoursEnum.purple,
    inactiveTintColor: ColoursEnum.darkGrey,
  },
});

export default createAppContainer(TabNavigator);
