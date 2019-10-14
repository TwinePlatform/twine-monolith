import React, { FC } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

import { Form as F } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Input from '../../../lib/ui/forms/InputWithIcon';
import { ColoursEnum } from '../../../lib/ui/colours';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';

const logo = require('../../../../assets/images/logo_image.png');

/*
 * Types
 */
type Props = {
  navigation: NavigationScreenProp<NavigationState, {}>;
};

/*
 * Styles
 */
const Page = styled.View`
  flex: 1;
  justifyContent: space-around;
  flexDirection: column;
  alignItems: center;
`;

const Container = styled.View`
  flex: 2;
  justifyContent: center;
  width: 100%;
  alignItems: center;
`;

const BottomContainer = styled(Container)`
  flex: 1;
  justifyContent: flex-end;
  paddingBottom: 20;
`;

const LinkText = styled.Text`
  textAlign: center;
  color: ${ColoursEnum.blue};
  fontSize: 17;
`;


const Image = styled.Image`
  width: 100;
  height: 100;
`;

const Form = styled(F)`
  width: 75%;
`;

/*
 * Component
 */
const Login: FC<Props> = (props) => (
  <Page>

    <Container>
      <Image source={logo} />
    </Container>

    <Container>
      <Form>
        <Input name="Email" autoCompleteType="email">
          <MaterialCommunityIcons name="email-outline" outline size={27} color={ColoursEnum.grey} />
        </Input>
        <Input name="Password" autoCompleteType="password" secureTextEntry>
          <MaterialCommunityIcons name="lock-outline" size={27} color={ColoursEnum.grey} />
        </Input>
        <SubmitButton text="LOG IN" onPress={() => props.navigation.navigate('VolunteerRouter')} />
        <SubmitButton text="LOG IN AS ADMIN" onPress={() => props.navigation.navigate('AdminRouter')} />
      </Form>
      <LinkText onPress={() => props.navigation.navigate('Register')}>
          Forgot password
      </LinkText>
    </Container>

    <BottomContainer>
      <LinkText onPress={() => props.navigation.navigate('Register')}>
          Create a new account
      </LinkText>
    </BottomContainer>

  </Page>
);

export default Login;
