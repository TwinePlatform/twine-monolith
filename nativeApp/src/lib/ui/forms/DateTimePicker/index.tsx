import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import {
  Item as I, Label as L, Text,
} from 'native-base';
import moment from 'moment';

import _DateTimePicker from 'react-native-modal-datetime-picker';

import { Forms } from '../enums';
import { ColoursEnum } from '../../colours';

/*
 * Types
 */
type Props = {
  label: string;
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (d: Date) => void;
}

/*
 * Styles
 */

const Value = styled(Text)`
  fontColor: ${ColoursEnum.darkGrey};
  paddingTop: 10;
  paddingBottom: 10;
`;

const Item = styled(I)`
  marginLeft: 0;
`;

const Label = styled(L)`
  width: ${Forms.labelWidth};
`;

const PlaceHolder = styled(Text)`
  paddingTop: 10;
  paddingBottom: 10;
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
  }
};

/*
 * Component
 */
const DateTimePicker: FC<Props> = (props) => {
  const {
    onConfirm, value, mode, label,
  } = props;
  const [isVisible, setIsVisible] = useState(false);

  const flipVisibility = () => setIsVisible(!isVisible);

  const onConfirmAndHide = (date: Date) => {
    onConfirm(date);
    flipVisibility();
  };


  return (

    <Item>
      <Label>{label}</Label>
      {value
        ? <Value onPress={flipVisibility}>{displayValue(mode, value)}</Value>
        : <PlaceHolder onPress={flipVisibility}>{`Select ${mode}`}</PlaceHolder>}
      <_DateTimePicker
        date={value}
        isVisible={isVisible}
        mode={mode}
        onConfirm={onConfirmAndHide}
        onCancel={flipVisibility}
      />
    </Item>

  );
};

export default DateTimePicker;
