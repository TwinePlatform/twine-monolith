import React from 'react';
import styled from 'styled-components/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Input from '../../../lib/ui/forms/input';

const View = styled.View`
  alignItems: center;
`;

const LoginContainer = styled.View`
  paddingTop: 200
  paddingBottom: 100
`;

const Button = styled.Button`
  paddingTop: 100;
`;

const Login = (props) => {

  return (
    <View>
      <LoginContainer>
        <Input name={"Email"}>
          <MaterialCommunityIcons name="email-outline" outline size={30} color="grey"/>
        </Input>
        <Input name={"Password"}>
          <MaterialCommunityIcons name="lock-outline" size={30} color="grey"/>
        </Input>
      </LoginContainer>

      <Button
        title="Register new user"
        onPress={() => props.navigation.navigate('Register')}
      />

      <Button
        title="Volunteer View"
        onPress={() => props.navigation.navigate('VolunteerRouter')}
      />
    </View>
  );
}

Login.navigationOptions = {
  
};

export default Login;
