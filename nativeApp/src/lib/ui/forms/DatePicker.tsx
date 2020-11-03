import React, { FC, useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {
  Item as I, Label as L, Text,
} from 'native-base';
import moment from 'moment';

import _DateTimePicker from '@react-native-community/datetimepicker';


import { Forms } from './enums';
import { ColoursEnum } from './../colours';

/*
 * Types
 */
type Props = {
  label: string;
  mode: 'date' | 'time' | 'datetime';
  value: Date;
  pickerVisible: Boolean;
  openPicker: any;
  closePicker: any;
  minDate?: Date;
  maxDate?: Date;
  onConfirm: (d: Date) => void;
  forUser?: string;
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
const DatePicker: FC<Props> = (props) => {
  const {
    onConfirm, value, mode, label, forUser, pickerVisible, openPicker, closePicker
  } = props;
  const [dateTime, setDateTime] = useState(value);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(),now.getMonth(),1);
  const startOfNextMonth =  moment(startOfMonth).add(1,'month');
  const endOfMonth = moment(startOfNextMonth).subtract(1,'day').toDate();

  const onConfirmAndHide = (_date: Date) => {
    closePicker();
    // NB: server rejects logs with identical times & users as they're
    // believed to be an offline sync issue
    if(_date){
        const _now = new Date();

        const date = new Date(_date.getFullYear(),_date.getMonth(),_date.getDate(),_now.getHours(),_now.getMinutes());
  
        setDateTime(date);
        onConfirm(date);
        }    
  };

  return (
    <Item>
      <Label>{label}</Label>
      {dateTime
        ? <Value onPress={openPicker}>{displayValue(mode, dateTime)}</Value>
        : <PlaceHolder onPress={openPicker}>{`Select ${mode}`}</PlaceHolder>}
    {pickerVisible &&
    <View
        style={{position: 'absolute', width: '100%', backgroundColor: 'white' }}
      >
        <_DateTimePicker
        minimumDate={forUser==="volunteer"?startOfMonth:null}
        maximumDate={forUser==="volunteer"?endOfMonth:null}
        value={dateTime}
        mode={mode}
        onChange={(event, values) => onConfirmAndHide(values)}
      />
    </View>
    }
    </Item>
  );
};

export default DatePicker;
