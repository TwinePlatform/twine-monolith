import React, { FC } from 'react';
import styled from 'styled-components/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {selectOrderedLogs} from '../../redux/entities/logs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ColoursEnum } from '../../lib/ui/colours';
import Stat from './Stat';
import Line from './Line';

const StatsView = styled.ScrollView`
  height: 50%;
  /*alignItems: center;*/
  paddingTop: 20;
  paddingBottom: 20;
  paddingLeft: 40;
  paddingRight: 40;
`;

type Props = {
}

export const StatsTab: FC<Props> = () => {
    const dispatch = useDispatch();
  
    const logs = useSelector(selectOrderedLogs, shallowEqual);
    let hours = 0;
    let minutes = 0;
    Object.keys(logs).forEach(object => {
      for (let key in logs[object].duration) {
        if (key == 'hours') {
          hours += logs[object].duration[key];
        }
        if (key == 'minutes') {
          minutes += logs[object].duration[key];
        }
      }
    });
  
    hours = ~~(hours + minutes / 60);
  
    const avgDur = ~~(hours * 60 / logs.length);
  
    return (
      <StatsView>
          <Stat
            heading="TOTAL TIME GIVEN"
            value={hours.toString()}
            unit="hours"
          >
            <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
          </Stat>
          <Line />
          <Stat
            heading="TIMES VOLUNTEERED"
            value={''+logs.length}
            unit="visits"
          >
            <MaterialCommunityIcons name="calendar-blank" outline size={35} color={ColoursEnum.mustard} />
          </Stat>
          <Line />
          <Stat
            heading="AVERAGE DURATION"
            value={avgDur.toString()}
            unit="minutes"
          >
            <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard} />
          </Stat>
      </StatsView>
    )
  };