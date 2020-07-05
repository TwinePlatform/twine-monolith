import React, { FC, useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';

import { createLog } from '../../../redux/entities/logs';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  flexDirection: column;
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
  paddingLeft: 40;
  paddingRight: 40;
  flex: 1;
`;

const Heading = styled(H)`
  flexGrow: 0;
`;

const Container = styled.View`
  width: 100%;
  flexGrow: 1;
  justifyContent: space-between;
`;

/*
 * Component
 */
const VolunteerHome: FC<Props> = () => {

  const dispatch = useDispatch();
  const [logged, setLogged] = useState(false);

  //access fail to send log and try logging them again
  const checkStorage = async () => {
    var logStore = await AsyncStorage.getItem('log cache');
    logStore = logStore == null ? [] : JSON.parse(logStore);
    const arr = Object.values(logStore);

    //return array of promise, assign a value null if succeed
    const newArray = await Promise.all(arr.map(item => {
      const res = createLog(item)(dispatch).then((result) => {
        if (result.status == 200) {
          return null;
        } else {
          return item;
        };
      });
      return res;

    }));

    const correctedArray = newArray.filter(obj => {
      return obj != null;
    });

    //updating the log (without successful logs)
    AsyncStorage.setItem(
      'log cache',
      JSON.stringify(correctedArray)
    );


  }

  useEffect(() => {
    checkStorage();
  }, []);

  return (
    <View>
      <Heading>My Stats</Heading>
      <Container>
        <Stat
          heading="TOTAL TIME GIVEN"
          value="109"
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="TIMES VOLUNTEERED"
          value="42"
          unit="visits"
        >
          <MaterialCommunityIcons name="calendar-blank" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="AVERAGE DURATION"
          value="120"
          unit="minutes"
        >
          <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
      </Container>

    </View>
  );
}
export default VolunteerHome;
