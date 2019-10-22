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
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  text: string;
}

/*
 * Styles
 */
const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.black};
`;

const Card = styled(C)`
  paddingVertical: 10;
  paddingHorizontal: 10;
  borderRadius: 5;
`;

const Text = styled.Text`
  letterSpacing: 1.1;
  fontSize: 15;
`;

const ButtonContainer = styled.View`
  justifyContent: center;
  flexDirection: row;
  marginTop: 10;
`;

const ButtonText = styled.Text<{buttonType: 'cancel' | 'confirm' }>`
  letterSpacing: 1.2;
  fontFamily:${FontsEnum.medium} 
  color: ${({ buttonType }) => (buttonType === 'cancel' ? ColoursEnum.darkGrey : ColoursEnum.purple)};
  fontSize: 18;
  `;

const StyledButton = styled(B)`
  width: 100;
  justifyContent: center;
`;

const Button = ({ onPress, buttonType }) => (
  <StyledButton transparent onPress={onPress}>
    <ButtonText buttonType={buttonType}>{ buttonType === 'cancel' ? 'Cancel' : 'Confirm'}</ButtonText>
  </StyledButton>
);

/*
 * Component
 */
const ConfirmationModal: FC<Props> = ({
  isVisible, onConfirm, onCancel, title, text,
}) => (
  <Modal isVisible={isVisible}>
    <Card>
      <Heading2>{title}</Heading2>
      <Text>{text}</Text>
      <ButtonContainer>
        <Button onPress={onCancel} buttonType="cancel" />
        <Button onPress={onConfirm} buttonType="confirm" />
      </ButtonContainer>
    </Card>
  </Modal>
);

export default ConfirmationModal;
