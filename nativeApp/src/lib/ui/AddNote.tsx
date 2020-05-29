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
  height: 20;
  width: 30%;
  borderRadius: 10;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 10;
  marginRight: 20;
`;

type Props = {
  onPress: () => void;
};

const AddNote: FC<Props> = (props) => {
  return <AddNoteButton
  onPress={props.onPress}
>
  <AddNoteText>Add note</AddNoteText>
</AddNoteButton>;
};

export default AddNote;