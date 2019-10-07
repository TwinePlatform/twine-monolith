import React, { FC } from 'react';
import styled from 'styled-components/native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

import { Form as F, Button as B } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Input from '../../../lib/ui/forms/InputWithIcon';
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
  width: 100%;
  alignItems: center;
`;

const BottomContainer = styled(Container)`
  flex: 1;
  justifyContent: flex-end;
  paddingBottom: 20;
`;

const Link = styled.Text`
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

const Submit = styled(B)`
  width: 75%;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  marginBottom: 40;
`

const SubmitText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 15;

`;
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
        <Form>
          <Input name="Email" autoCompleteType="email">
            <MaterialCommunityIcons name="email-outline" outline size={27} color={ColoursEnum.grey}/>
          </Input>
          <Input name="Password" autoCompleteType="password" secureTextEntry={true}>
            <MaterialCommunityIcons name="lock-outline" size={27} color={ColoursEnum.grey}/>
          </Input>
        </Form>

        <Submit
          onPress={() => props.navigation.navigate('VolunteerRouter')}
        >
          <SubmitText>LOG IN</SubmitText>
        </Submit>
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
