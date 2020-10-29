import React, { FC } from "react";
import styled from "styled-components/native";
import { ColoursEnum } from "./colours";
import { FontsEnum } from "./typography";
import { Button as B } from 'native-base';

const AddNoteText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 15;
  font-family: ${FontsEnum.medium};
`;

const AddNoteButton = styled(B)`
  height: 26;
  width: 30%;
  borderRadius: 10;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 10;
  marginRight: 20;
`;

const AddCloseButton = styled(B)`
  height: 26;
  width: 30%;
  borderRadius: 10;
  backgroundColor: ${ColoursEnum.yellow};
  alignItems: center;
  justifyContent: center;
  marginTop: 10;
  marginRight: 20;
`;

type Props = {
  text: string;
  onPress: () => void;
  disabled: boolean;
};

export const AddNote: FC<Props> = (props) => {
  return <AddNoteButton
    onPress={props.onPress}
    disabled={props.disabled}
    style={{opacity: props.disabled?0.3:1}}
  >
    <AddNoteText>{props.text}</AddNoteText>
  </AddNoteButton>;
};

export const Close: FC<Props> = (props) => {
  return <AddCloseButton
    onPress={props.onPress}
  >
    <AddNoteText>Cancel</AddNoteText>
  </AddCloseButton>;
};