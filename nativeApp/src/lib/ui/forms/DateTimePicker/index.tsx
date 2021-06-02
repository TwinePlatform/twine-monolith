import React, { FC, useState, useEffect} from 'react';
import {View, Platform} from 'react-native';
import styled from 'styled-components/native';
import {
  Item as I, Label as L, Text,
} from 'native-base';
import moment from 'moment';

//import _DateTimePicker from 'react-native-modal-datetime-picker';
import _DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';


import { Forms } from '../enums';
import { ColoursEnum } from '../../colours';
import useToggle from '../../../hooks/useToggle';
import { getDateWithCurrentTime } from './util';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

/*
 * Types
 */
type Props = {
  label: string;
  mode: 'date' | 'time' | 'datetime';
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onConfirm: (d: Date) => void;
}

/*
 * Styles
 */

const Value = styled(Text)`
  color: ${ColoursEnum.black};
  paddingTop: 15;
  paddingBottom: 15;
`;

const Item = styled(I)`
  marginLeft: 0;
  display: flex;
`;

const Label = styled(L)`
  width: ${Forms.labelWidth};
`;

const PlaceHolder = styled(Text)`
  paddingTop: 15;
  paddingBottom: 15;
  color: ${ColoursEnum.grey};
`;

/*
 * Helpers
 */

const displayValue = (mode, value: Date) => {
  switch (mode) {
    case 'date':
      return moment(value).format('DD-MM-YY');

    case 'time':
    default:
      return moment(value).format('LT');

    case 'datetime':
      return moment(value).format('DD-MM-YY HH:mm');
  }
};

/*
 * Component
 */
const TwineDateTimePicker: FC<Props> = (props) => {
  const {
    onConfirm, value, mode, label, minDate, maxDate,
  } = props;
  const [isVisible, toggleVisibility] = useToggle(false);
  const [modeInternal, setModeInternal] = useState(mode);
  const [dateTime, setDateTime] = useState(value);
  const [androidDate, setAndroidDate] = useState(new Date());

  useEffect(()=>{
    setDateTime(value);
  },[value]);

  const onConfirmAndHide = (_date: Date) => {
    if(Platform.OS == "android"){
      if(modeInternal == "datetime"){
        setAndroidDate(_date);
        setDateTime(_date);
      }
      else
        if(modeInternal == "time"){
          const mergedDateTime = new Date(androidDate.getFullYear(),androidDate.getMonth(),androidDate.getDate(),_date.getHours(),_date.getMinutes());
  
          setDateTime(mergedDateTime);
          onConfirm(mergedDateTime);
          
          //setDateTime(new Date(dateTime.getDate(),_date.getTime()));
        }

      
      setModeInternal(modeInternal == "datetime"? "time":"datetime");
      toggleVisibility();

    }
    else{
      setDateTime(_date);
      onConfirm(_date);
      toggleVisibility();
    }

    
        
    
    // NB: server rejects logs with identical times & users as they're
    // believed to be an offline sync issue

    // const date = getDateWithCurrentTime(_date);
    
    
  };

  return (
    <Item>
      <Label>{label}</Label>
      {dateTime
        ? <Value onPress={toggleVisibility}>{displayValue(mode, dateTime)}</Value>
        : <PlaceHolder onPress={toggleVisibility}>{`Select ${mode}`}</PlaceHolder>}
    {isVisible && Platform.OS == 'android' &&
      <_DateTimePicker
        minimumDate={minDate}
        maximumDate={maxDate}
        value={dateTime}
        mode={modeInternal}
        onChange={(event, values) => onConfirmAndHide(values)}
        //onCancel={toggleVisibility}
       // titleIOS={`Pick a ${mode}`}
      />
    }
    {isVisible && Platform.OS == 'ios' &&
    <View
        style={{position: 'absolute', width: '100%', backgroundColor: 'white' }}
      >
          <_DateTimePicker
        minimumDate={minDate}
        maximumDate={maxDate}
        value={dateTime}
        mode={"datetime"}
        onChange={(event, values) => onConfirmAndHide(values)}
        //onCancel={toggleVisibility}
        //titleIOS={`Pick a ${mode}`}
      />
    </View>
    }
    </Item>
  );
};

export default TwineDateTimePicker;
