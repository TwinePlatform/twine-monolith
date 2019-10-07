import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Item as I, Label as L, Button as B } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ColoursEnum } from '../../../lib/ui/colours';


/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  marginLeft: 0;
  width:100%;
  justifyContent: space-between;
`;

const Label = styled(L)`
  color: ${ColoursEnum.darkGrey}
`;

const Button = styled(B)`
  alignItems: center;
  justifyContent: center;
`;
/*
 * Component
 */
const Toggle: FC<Props> = () => (
  <Item inlineLabel>
    <Button transparent>
      <Label>Terms and Conditions</Label>
      <MaterialIcons name="keyboard-arrow-right" size={30} color={ColoursEnum.darkGrey}/>
    </Button>
  </Item>
);

export default Toggle;
