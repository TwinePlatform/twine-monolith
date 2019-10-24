import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { withNavigation, NavigationParams, NavigationInjectedProps } from 'react-navigation';
import { ColoursEnum } from './colours';


/*
 * Types
 */
type Props = {
} & NavigationParams

/*
 * Styles
 */

const Clickable = styled.TouchableOpacity`
  paddingLeft: 10;
  paddingRight: 10;
`;
/*
 * Component
 */
const SettingsButton: FC<NavigationInjectedProps<Props>> = (props) => (
  <Clickable onPress={() => props.navigation.navigate('SettingsPage')}>
    <Feather name="settings" color={ColoursEnum.white} size={25} />
  </Clickable>
);
export default withNavigation(SettingsButton);
