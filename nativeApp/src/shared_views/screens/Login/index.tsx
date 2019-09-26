import React from 'react';
import styled from 'styled-components/native'

import { Heading } from '../../../lib/ui/typography';
import Input from '../../../lib/ui/forms/input';

const View = styled.View`
  alignItems: center;
`;

const LoginContainer = styled.View`
  paddingTop: 100
`;

const Button = styled.Button`
  paddingTop: 100
`;

const Login = (props) => {

  return (
    <View>
      <Heading>Login</Heading>
      <LoginContainer>
        <Input name={"email"}/>
        <Input name={"password"}/>
      </LoginContainer>

      <Button
        title="Register new user"
        onPress={() => props.navigation.navigate('Register')}
      />

      <Button
        title="VolunteerRouter"
        onPress={() => props.navigation.navigate('VolunteerRouter')}
      />
    </View>
  );
}

Login.navigationOptions = {
  
};

export default Login;
