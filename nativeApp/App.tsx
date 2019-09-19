import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommunityBusinesses } from './src/lib/api';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});

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
    <View style={styles.container}>
      {data && data.map(x => <Text key={x.id}>{x.name}</Text>)}
      {error && <Text>{JSON.stringify(error)}</Text>}
    </View>
  );
}
