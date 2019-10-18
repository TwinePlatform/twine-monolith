import React, { FC } from 'react';
import styled from 'styled-components/native';
import {
  Item as I, Label as L, Text,
} from 'native-base';
import moment from 'moment';

import _DateTimePicker from 'react-native-modal-datetime-picker';

import { Forms } from '../enums';
import { ColoursEnum } from '../../colours';
import useToggle from '../../../hooks/useToggle';

/*
 * Types
 */
type Props = {
  label: string;
  mode: 'date' | 'time';
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  onConfirm: (d: Date) => void;
}

/*
 * Styles
 */

const Value = styled(Text)`
  fontColor: ${ColoursEnum.darkGrey};
  paddingTop: 15;
  paddingBottom: 15;
`;

const Item = styled(I)`
  marginLeft: 0;
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
  }
};

/*
 * Component
 */
const DateTimePicker: FC<Props> = (props) => {
  const {
    onConfirm, value, mode, label, minDate, maxDate,
  } = props;
  const [isVisible, toggleVisibility] = useToggle(false);

  const onConfirmAndHide = (date: Date) => {
    onConfirm(date);
    toggleVisibility();
  };

  return (
    <Item>
      <Label>{label}</Label>
      {value
        ? <Value onPress={toggleVisibility}>{displayValue(mode, value)}</Value>
        : <PlaceHolder onPress={toggleVisibility}>{`Select ${mode}`}</PlaceHolder>}
      <_DateTimePicker
        minimumDate={minDate}
        maximumDate={maxDate}
        date={value}
        isVisible={isVisible}
        mode={mode}
        onConfirm={onConfirmAndHide}
        onCancel={toggleVisibility}
        titleIOS={`Pick a ${mode}`}
      />
    </Item>

  );
};

export default DateTimePicker;
