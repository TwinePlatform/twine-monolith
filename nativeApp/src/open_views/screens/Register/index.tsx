import React from 'react';
import styled from 'styled-components/native'

import { CommunityBusinesses } from '../../../lib/api'
import useRequest from '../../../lib/hooks/requestHook';
import { Heading } from '../../../lib/ui/typography';

const View = styled.View`
  alignItems: center;
  justifyContent: center;
  flex: 1;
`;

const Picker = styled.Picker`
  width: 200;
  height: 40;
`;

const Text = styled.Text`
  font-size: 15;
`;


export default function Register() {
  const [data, error] = useRequest(CommunityBusinesses.getVolunteerActivities);

  return (
    <View>
      <Heading>Register</Heading>
      <Picker
        // onValueChange={(itemValue, itemIndex) =>
        //   this.setState({language: itemValue})
        // }
      >
        {data && data.map(x => <Picker.Item key={x.id} label={x.name} value={x.name}/>)}

      </Picker>
      {/* {data && data.map(x => <Text key={x.id}>{x.name}</Text>)} */}
      {error && <Text>{JSON.stringify(error)}</Text>}
    </View>
  );
}
