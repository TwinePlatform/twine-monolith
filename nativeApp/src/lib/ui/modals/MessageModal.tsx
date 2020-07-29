import React, { FC } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Card as C } from 'native-base';
import NoteButton from '../NoteButton';

import { Heading2 as H2, FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

/*
 * Styles
 */

const Container = styled.View`
  alignItems: center;
`;

const HeadingContainer = styled.View`
  backgroundColor: ${ColoursEnum.purple};
  borderTopLeftRadius: 10;
  borderTopRightRadius: 10;
`;

const Heading2 = styled(H2)`
  paddingHorizontal: 15;
  paddingTop: 10;
  marginBottom: 10;
  color: ${ColoursEnum.white};
`;

const Card = styled(C)`
  width: 80%;
  paddingBottom: 10;
  borderRadius: 10;
`;

const ButtonContainer = styled.View`
  justifyContent: flex-end;
  flexDirection: row;
  marginTop: 20;
`;

const Text = styled.Text`
  textAlign: center;
  color: ${ColoursEnum.darkGrey};
  fontSize: 17;
`;
/*
 * Component
 */


const MessageModal: FC<Props> = ({
  isVisible, message, onClose
}) => {

  return (
    <Modal isVisible={isVisible}>
      <Container>
        <Card>
          <HeadingContainer>
            <Heading2>TWINE</Heading2>
          </HeadingContainer>
          <Text>{message}</Text>
          <ButtonContainer>
            <NoteButton label={"Close"} onPress={onClose} />
          </ButtonContainer>
        </Card>
      </Container>
    </Modal>
  )
};

export default MessageModal;
