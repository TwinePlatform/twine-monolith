import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import VolunteerHome from './screens/VolunteerHome'

const TabNavigator = createBottomTabNavigator({
  Home: VolunteerHome,
});

export default createAppContainer(TabNavigator);
