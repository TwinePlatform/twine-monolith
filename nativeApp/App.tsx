import React, { useState, useEffect} from 'react';
import styled from 'styled-components/native'

import { CommunityBusinesses } from './src/lib/api';

const View = styled.View`
  alignItems: center;
  justifyContent: center;
  flex: 1;
`;

const Text = styled.Text`
  font-size: 15;
`;

export default function App() {
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {(
    async function(){
      try {
        const {data} = await CommunityBusinesses.getVolunteerActivities();
        setData(data.result);
      } catch (error) {
        setError(error)
      }
    }()
    )},[]);
    
  return (
    <View>
      {data && data.map(x => <Text key={x.id}>{x.name}</Text>)}
      {error && <Text>{JSON.stringify(error)}</Text>}
    </View>
  );
}
