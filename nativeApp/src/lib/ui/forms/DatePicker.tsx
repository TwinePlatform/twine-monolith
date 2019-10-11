import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Item as I, Label as L, DatePicker as _DatePicker } from 'native-base';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  onDateChange: (d: any) => void;
}

/*
 * Styles
 */
const Item = styled(I)`
  marginLeft: 0;
`;

const Label = styled(L)`
  width: ${Forms.labelWidth}
`;

/*
 * Component
 */
const DatePicker: FC<Props> = (props) => {
  const { onDateChange } = props;
  return (
    <Item>
      <Label>Date</Label>
      <_DatePicker
        defaultDate={new Date()}
        locale="en"
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={false}
        animationType="fade"
        androidMode="default"
        placeHolderText="Select date"
        textStyle={{ color: ColoursEnum.darkGrey }}
        placeHolderTextStyle={{ color: ColoursEnum.grey }}
        onDateChange={onDateChange}
        disabled={false}
      />
    </Item>
  );
};

export default DatePicker;
