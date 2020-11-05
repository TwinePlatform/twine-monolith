import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Content, Card as C, Textarea as T, Form } from 'native-base';
import {View, KeyboardAvoidingView, Dimensions, Text} from 'react-native';
import { AddNote, Close } from '../AddNote';

import { Heading2 as H2, FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  isVisible: boolean;
  addNote: React.Dispatch<React.SetStateAction<string>>;
  initialNote: string;
  onClose: () => void;
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
    borderColor: ${ColoursEnum.mustard};
    paddingTop: 5;
    borderWidth: 3;
`;

const ButtonContainer = styled.View`
  justifyContent: flex-end;
  flexDirection: row;
  marginTop: 20;
  marginBottom:10;
`;

/*
 * Component
 */


const NoteModal: FC<Props> = ({
  isVisible, addNote, initialNote, onClose
}) => {
  const [note, setNote] = useState(initialNote);

  return (
    <Modal isVisible={isVisible}>
      <KeyboardAvoidingView>
      <Card>
        <HeadingContainer>
          <Heading2>TWINE</Heading2>
        </HeadingContainer>
        <Form>
          <Textarea rowSpan={5} value={note} onChangeText={text => setNote(text)} 
          //editable={note.length <= 500}
          />
        </Form>
        <View
          style={{flexDirection: 'row-reverse'}}
        >
          <Text
            style={{color: note.length>500?'red':'black', marginRight: 20}}
          >Characters left: {500-note.length}</Text>
        </View>
        <ButtonContainer>
          <Close onPress={() => { onClose(); }} />
          <AddNote disabled={note.length>500} text='Add note' onPress={() => { addNote(note); onClose(); }} />
        </ButtonContainer>
      </Card>
      </KeyboardAvoidingView>
    </Modal>
  )
};

export default NoteModal;
