import React, { FC } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Button as B, Card as C } from 'native-base';

import { Heading2 as H2, FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  isVisible: boolean;
  onContinue: () => void;

}

/*
 * Styles
 */
const Heading2 = styled(H2)`
  textAlign: center;
  marginBottom: 20;
  color: ${ColoursEnum.black};
`;

const Card = styled(C)`
  paddingHorizontal: 15;
  paddingTop: 15;
  paddingBottom: 10;
  borderRadius: 5;
`;

const ButtonContainer = styled.View`
  justifyContent: center;
  flexDirection: row;
  marginTop: 10;
`;

const ButtonText = styled.Text`
  letterSpacing: 1.2;
  fontFamily:${FontsEnum.medium} 
  color: ${ColoursEnum.purple};
  fontSize: 18;
  `;

const StyledButton = styled(B)`
  width: 100;
  justifyContent: center;
`;

const Button = ({ onPress }) => (
  <StyledButton transparent onPress={onPress}>
    <ButtonText>Continue</ButtonText>
  </StyledButton>
);

/*
 * Component
 */
const SavedModal: FC<Props> = ({ isVisible, onContinue }) => (
  <Modal isVisible={isVisible}>
    <Card>
      <Heading2>Saved</Heading2>
      <ButtonContainer>
        <Button onPress={onContinue} />
      </ButtonContainer>
    </Card>
  </Modal>
);

export default SavedModal;
