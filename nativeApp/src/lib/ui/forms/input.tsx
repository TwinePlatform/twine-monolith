import React, { FC } from 'react';
import styled from 'styled-components/native'
import { Item as I, Input as _Input } from 'native-base';
import { TextInputProps } from 'react-native';

import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  name: string;
  value?: string;
} & TextInputProps

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  marginLeft: 0;
`;

const Input: FC<Props> = (props) => {
  const { children: icon, name, value, ...rest} = props;
  return (
    <Item>
      {icon}
      <_Input placeholder={name} placeholderTextColor={ColoursEnum.grey}  {...rest}>{value}</_Input>
    </Item>
  )
}

export default Input;
