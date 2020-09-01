import React, { FC } from 'react';
import styled from 'styled-components/native';
import {
  Item as I, Input as _Input, Label as L, Icon,
} from 'native-base';
import { TextInputProps, TextInput } from 'react-native';
import { Forms } from './enums';


/*
 * Types
 */
interface Props extends TextInputProps {
  ref?: any;
  label: string;
  value?: string;
  error?: boolean;
  name?: string;
}

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
  const {
    error, label, value, name, ...rest
  } = props;
  return (

    <Item inlineLabel error={error}>
      <Label>{label}</Label>
      <_Input {...rest}>{value}</_Input>
      {error && <Icon name="close-circle" />}
    </Item>
  );
};

export default Input;
