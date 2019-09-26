import React from 'react';
import styled from 'styled-components/native'
import { Fonts } from '../typography';

const InputContainer = styled.View`
  flexDirection: row;
  marginTop: 20;
  marginBottom: 20;
  borderBottomWidth: 1;
  borderColor: grey
`;

const ChildBox = styled.View`
`;

const InputText = styled.TextInput`
  fontFamily: ${Fonts.medium}
  marginLeft: 10;
  paddingTop: 5;
  paddingBottom: 12;
  paddingLeft: 5;
  paddingRight: 5;
  width: 250;
  fontSize: 20;
`;

const Input = (props) => {
  return (
    <InputContainer>
      <ChildBox>
        {props.children}
      </ChildBox>
      <InputText placeholder={props.name}></InputText>
    </InputContainer>
  )
}

export default Input;
