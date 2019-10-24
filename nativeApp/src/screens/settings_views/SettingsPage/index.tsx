import React, { FC } from 'react';
import styled from 'styled-components/native';

import { Form as F } from 'native-base';
import { NavigationInjectedProps } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { Forms } from '../../../lib/ui/forms/enums';
import LinkItem from '../../../lib/ui/forms/LinkItem';
import Page from '../../../lib/ui/Page';
import Toggle from '../../../lib/ui/forms/Toggle';
/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Form = styled(F)`
  width: ${Forms.formWidth}
`;
/*
 * Component
 */

const Settings: FC<NavigationInjectedProps & Props> = ({ navigation }) => {
  const logOut = async () => {
    await AsyncStorage.clear();
    navigation.navigate('AuthStack');
  };
  return (
    <Page heading="Settings">
      <Form>
        <LinkItem title="Profile" onPress={() => navigation.navigate('Profile')} />
        <LinkItem title="Help" />
        <Toggle label="Locations reminders" />
        <LinkItem title="Terms and Conditions" />

        <LinkItem title="Log Out" onPress={() => logOut()} />
      </Form>
    </Page>
  );
};

export default Settings;
