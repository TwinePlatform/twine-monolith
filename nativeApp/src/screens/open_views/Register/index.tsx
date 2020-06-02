import React from 'react';
import styled from 'styled-components/native';
import { Picker,TextInput, View ,Text} from 'react-native';

import { Heading } from '../../../lib/ui/typography';
import Page from '../../../lib/ui/Page';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

const StyledPicker = styled.Picker`
  width: 200;
  height: 40;
`;

// const Text = styled.Text`
//   font-size: 15;
// `;

/*
 * Component
 */
const Register = () => {
// TODO make request through redux
  return (
    <Page heading="Register">
      <View>


      <StyledPicker>

<Text> Admin</Text>
<Text> User  </Text>
{/* {data && data.map((x) => <Picker.Item key={x.id} label={x.name} value={x.name} />)} */}
</StyledPicker>
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5 }} placeholder = {" Full Name"}  />
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Email"}/>
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Create Password"} />
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Phone Number"}  />
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Post Code"}/>
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Phone Number"}/>
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Gender"}/>
        <TextInput style={{height: 10, width: 50, borderColor: 'gray', borderWidth: 1 ,fontSize: 5}} placeholder = {" Admin Code"}/>


        {/* 
        
        -  Full Name
  -  Email 
  -  Create Password
  -  Post Code 
  -  Phone Number 
  -  Gender 
  -  Admin Code (Autth)  
        
        */}
</View>
      <Heading>Register</Heading>
     

{/* 
<StyledPicker> {/* {data && data.map((x) => <Picker.Item key={x.id} label={x.name} value={x.name} />)} 
      </StyledPicker>
      {error && <Text>{JSON.stringify(error)}</Text>} */}
    </Page>
  );
}

export default Register;