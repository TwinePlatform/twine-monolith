import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Item as I, Label as L, Button as B } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
  title: string;
  onPress: () => void;
}

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  marginLeft: 0;
  width: 100%;
  justifyContent: space-between;
`;

const Label = styled(L)`
  color: ${ColoursEnum.darkGrey}
`;

const Button = styled(B)`
  alignItems: center;
  width: 100%;
`;

/*
 * Component
 */
const LinkItem: FC<Props> = ({ title, children: icon, onPress }) => (
  <Item inlineLabel>
    <Button transparent onPress={onPress}>
      {icon}
      <Label>{title}</Label>
      <AntDesign name="caretright" size={15} color={ColoursEnum.darkGrey} />
    </Button>
  </Item>
);

export default LinkItem;
