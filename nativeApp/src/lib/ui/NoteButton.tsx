import React, { FC } from "react";
import styled from "styled-components/native";
import { ColoursEnum } from "./colours";
import { FontsEnum } from "./typography";
import { Button as B } from 'native-base';

const NoteText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 15;
  font-family: ${FontsEnum.medium};
  marginTop: 1;
  marginBottom: 1;
`;

const BlankNoteButton = styled(B)`
  height: 29;
  width: 30%;
  borderRadius: 10;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginRight: 20;
  box-shadow: 2px 2px 2px ${ColoursEnum.grey};
`;

type Props = {
  onPress: () => void,
  label: string

};

const NoteButton: FC<Props> = (props) => {
  return <BlankNoteButton
    onPress={props.onPress}
  >
    <NoteText>{props.label}</NoteText>
  </BlankNoteButton>;
};

export default NoteButton;