import React from 'react';
import styled from 'styled-components/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import Stat from './Stat'

const View = styled.View`
  flexDirection: column;
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
  paddingLeft: 40;
  paddingRight: 40;
`;

const Heading = styled(H)`
  
`;

const Container = styled.View`
  width: 100%;
  height: 95%;
  justifyContent: space-around;
`;

const Line = styled.View`
  alignSelf: center;
  width: 85%;
  borderBottomWidth: 1;
  borderColor: ${ColoursEnum.grey};
`;

export default function VolunteerHome(props) {

  return (
    <View>
      <Heading>Your Time</Heading>
      <Container>

        <Stat 
          heading="TOTAL TIME GIVEN"
          value="109"
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard}/>
        </Stat>
        <Line/>
        <Stat 
          heading="TIMES VOLUNTEERED"
          value="42"
          unit="visits"
        >
          <MaterialCommunityIcons name="calendar-blank" outline size={35} color={ColoursEnum.mustard}/>
        </Stat>
        <Line/>
        <Stat 
          heading="AVERAGE DURATION"
          value="120"
          unit="minutes"
        >
          <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard}/>
        </Stat>
      </Container>
      
    </View>
  );
}
