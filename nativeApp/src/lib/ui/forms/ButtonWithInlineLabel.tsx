import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Item as I, Label as L, Button as B } from 'native-base';
import { ColoursEnum } from '../colours';
import { Forms } from './enums';

/*
 * Types
 */
type Props = {
  label: string;
  text: string;
  onPress?: () => void;
}

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  marginLeft: 0;
  width:100%
`;

const Button = styled(B)`
`;

const Text = styled.Text`
  color: ${ColoursEnum.blue}
`;

const Label = styled(L)`
  width: ${Forms.labelWidth};
`;

/*
 * Component
 */
const LabeledButton: FC<Props> = (props) => {
  const { label, text, onPress } = props;
  return (
    <Item inlineLabel>
      <Label>{label}</Label>
      <Button transparent onPress={onPress}>
        <Text>
          {text}
        </Text>
      </Button>
    </Item>
  );
};

export default LabeledButton;
