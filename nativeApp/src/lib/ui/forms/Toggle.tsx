import React, { FC } from 'react';
import styled from 'styled-components/native'
import { Switch, SwitchProps } from 'react-native'
import { Item as I, Input as _Input, Label as L } from 'native-base';
import { Forms } from './enums';


/*
 * Types
 */
type Props = {
  label: string;
  value?: string;
} & SwitchProps

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
const Toggle: FC<Props> = (props) => {
  const { label, ...rest} = props;
  return (
    <Item inlineLabel>
      <Label>{label}</Label>
      <Switch {...rest}/>
    </Item>
  )
}

export default Toggle;
