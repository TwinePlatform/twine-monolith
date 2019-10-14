import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import {
  Form as F, Item as I, Label as L, Text,
} from 'native-base';

import DateTimePicker from 'react-native-modal-datetime-picker';

import { Forms } from './enums';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  value: string;
  onConfirm: (d: Date) => void;
}

/*
 * Styles
 */

const Value = styled(Text)`
  fontColor: ${ColoursEnum.darkGrey};
  paddingTop: 5;
  paddingBottom: 5
`;

const Item = styled(I)`
  marginLeft: 0;
`;

const Label = styled(L)`
  width: ${Forms.labelWidth}
`;

const PlaceHolder = styled(Text)`
  paddingTop: 5;
  paddingBottom: 5
  color: ${ColoursEnum.grey}
`;

/*
 * Component
 */
const TimePicker: FC<Props> = (props) => {
  const { onConfirm, value } = props;
  const [isStartTimeVisible, setIsStartTimeVisible] = useState(false);

  const flipStartTimeVisibility = () => setIsStartTimeVisible(!isStartTimeVisible);

  const onConfirmAndHide = (date: Date) => {
    onConfirm(date);
    flipStartTimeVisibility();
  };

  return (

    <Item>
      <Label>Start Time</Label>
      {value
        ? <Value onPress={flipStartTimeVisibility}>{value}</Value>
        : <PlaceHolder onPress={flipStartTimeVisibility}>Select time</PlaceHolder>}
      <DateTimePicker isVisible={isStartTimeVisible} mode="time" onConfirm={onConfirmAndHide} onCancel={flipStartTimeVisibility} />
    </Item>

  );
};

export default TimePicker;
