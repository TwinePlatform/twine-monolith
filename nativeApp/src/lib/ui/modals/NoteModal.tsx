import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Content, Card as C, Textarea as T, Form } from 'native-base';
import {View, KeyboardAvoidingView, Dimensions, Text, Platform, Keyboard} from 'react-native';
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




const getNumberOfRows = (height: number) => {

  if(height < 300)
    return 2;
  if(height < 600)
    return 3;
  if(height < 1200)
    return 4;

  return 5;
}

/*
 * Component
 */


const NoteModal: FC<Props> = ({
  isVisible, addNote, initialNote, onClose
}) => {
  const [note, setNote] = useState(initialNote);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const dismissKeyboard = () => {
    if(keyboardVisible){
      Keyboard.dismiss()
      setKeyboardVisible(false);
    }
  }

  //tapping on the modal dismisses the keyboard
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const modalContent = (<Card
    onTouchEnd={dismissKeyboard}
  >
  <HeadingContainer>
    <Heading2>TWINE</Heading2>
  </HeadingContainer>
  <Form>
    <Textarea 
      rowSpan={getNumberOfRows(Dimensions.get("window").height)} 
      value={note} 
      onChangeText={text => {setNote(text)}} 
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
  </Card>)

  if(Platform.OS === "ios")
    return (
      <Modal isVisible={isVisible}>
      {/* KeyboardAvoidingView blocks taps while keyboard is up
          So, only using it where we have to on iOS.
      */}
      <KeyboardAvoidingView
        behavior={"padding"}
        >
          {modalContent}
      </KeyboardAvoidingView>
    </Modal>)
  else
    return (
      <Modal isVisible={isVisible}>
        {modalContent}
      </Modal>
    )
  
};

export default NoteModal;
