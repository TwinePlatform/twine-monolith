import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Item as I, Input as _Input, Label as L } from 'native-base';
import { TextInputProps } from 'react-native';
import { Forms } from './enums';


/*
 * Types
 */
type Props = {
  label: string;
  value?: string;
} & TextInputProps

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  marginLeft: 0;
  width:100%
`;

const Label = styled(L)`
 width: ${Forms.labelWidth};
`;

/*
 * Component
 */
const Input: FC<Props> = (props) => {
  const { label, value, ...rest } = props;
  return (
    <Item inlineLabel>
      <Label>{label}</Label>
      <_Input {...rest}>{value}</_Input>
    </Item>
  );
};

export default Input;
