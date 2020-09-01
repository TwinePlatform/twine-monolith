import React, { FC } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Card as C, Textarea as T, Form } from 'native-base';
import NoteButton from '../NoteButton';

import { Heading2 as H2} from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  isVisible: boolean;
  note: string;
  onClose: ()=>void;
}

/*
 * Styles
 */
const HeadingContainer = styled.View`
  backgroundColor: ${ColoursEnum.purple};
  borderTopLeftRadius: 10;
  borderTopRightRadius: 10;
`;

const Heading2 = styled(H2)`
  paddingHorizontal: 15;
  paddingTop: 15;
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;

const Card = styled(C)`
  paddingBottom: 10;
  borderRadius: 10;
`;

const Textarea = styled(T)`
    marginHorizontal: 15;
    marginTop: 15;
    borderColor: ${ColoursEnum.grey};
    paddingTop: 5;
    borderWidth: 3;
`;

const ButtonContainer = styled.View`
  justifyContent: flex-end;
  flexDirection: row;
  marginTop: 20;
`;

/*
 * Component
 */


const ViewNoteModal: FC<Props> = ({
  isVisible, note, onClose
}) => {

return(
  <Modal isVisible={isVisible}>
    <Card>
      <HeadingContainer>
        <Heading2>TWINE</Heading2>
      </HeadingContainer>
      <Form>
      <Textarea rowSpan={5}  value={note} disabled/>    
      </Form>
      <ButtonContainer>
        <NoteButton label={"Close"} onPress={()=> onClose()}  />
      </ButtonContainer>
    </Card>
  </Modal>
)};

export default ViewNoteModal;
