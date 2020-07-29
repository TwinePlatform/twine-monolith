import React, { FC } from 'react';
import styled from 'styled-components/native';
import { ColoursEnum } from './colours';
import { FontsEnum } from './typography';

/*
 * Types
 */
type Props = {
  onPress: () => void;
  title: string;
}

/*
 * Styles
 */
const Container = styled.View`
  width: 85%;
  justifyContent: flex-end;
  alignItems: flex-end;
`;

const Button = styled.TouchableOpacity`
  paddingTop: 10;
  paddingBottom: 10;
`;

const Text = styled.Text`
  color: ${ColoursEnum.purple};
  fontFamily: ${FontsEnum.regular};
  fontSize: 16;
`;
/*
 * Component
 */
const AddBar: FC<Props> = ({ onPress, title }) => (
  <Container>
    <Button onPress={onPress}>
      <Text>{title}</Text>
    </Button>
  </Container>
);

export default AddBar;
