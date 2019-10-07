import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Switch, SwitchProps } from 'react-native';
import { Item as I, Label as L } from 'native-base';

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
  width:100%;
  paddingTop: 12;
  paddingBottom: 12;
  justifyContent: space-between;
`;

const Label = styled(L)`
`;

/*
 * Component
 */
const Toggle: FC<Props> = (props) => {
  const { label, ...rest } = props;
  return (
    <Item inlineLabel>
      <Label>{label}</Label>
      <Switch {...rest} />
    </Item>
  );
};

export default Toggle;
