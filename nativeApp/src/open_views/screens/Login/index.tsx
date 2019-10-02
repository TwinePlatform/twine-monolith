import React, { FC } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button as B } from 'react-native-elements';

import Input from '../../../lib/ui/forms/input';
import { ColoursEnum } from '../../../lib/ui/colours';

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
`;

const BottomContainer = styled(Container)`
  flex: 1;
  justifyContent: flex-end;
  paddingBottom: 20;
`;

const Link = styled.Text`
  textAlign: center;
  color: #007bff;
  fontSize: 17;
`;


const Image = styled.Image`
  width: 100;
  height: 100;
`;

const Submit = styled(B).attrs({
  buttonStyle: {
    backgroundColor: ColoursEnum.purple,
    padding: 15,
  },
  containerStyle:{
    width: 290,
    paddingBottom: 10,
  }
})``;

/*
 * Component
 */
const Login: FC<Props> = (props) => {

  return (
    <Page>

      <Container>
        <Image source={require('../../../../assets/images/logo_image.png')}/>
      </Container>

      <Container>
        <Input name={"Email"}  autoCompleteType="email">
          <MaterialCommunityIcons name="email-outline" outline size={27} color={ColoursEnum.grey}/>
        </Input>
        <Input name={"Password"} autoCompleteType="password" secureTextEntry={true}>
          <MaterialCommunityIcons name="lock-outline" size={27} color={ColoursEnum.grey}/>
        </Input>
        <Submit
          title="LOG IN"
          onPress={() => props.navigation.navigate('VolunteerRouter')}
        />
        <Link
          onPress={() => props.navigation.navigate('Register')}
        >
          Forgot password
        </Link>
      </Container>

      <BottomContainer>
        <Link
          onPress={() => props.navigation.navigate('Register')}
        >
          Create a new account
        </Link>
      </BottomContainer>

    </Page>
  );
};

export default Login;
