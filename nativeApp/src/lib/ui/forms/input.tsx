import React from 'react';
import styled from 'styled-components/native'

const InputContainer = styled.View`
  marginTop: 5;
  marginBottom: 5;
`;

const Label = styled.Text`
  fontSize: 20;
`;

const InputText = styled.TextInput`
  paddingTop: 5;
  paddingBottom: 5;
  paddingLeft: 5;
  paddingRight: 5;
  borderRadius: 5;
  borderWidth: 1;
  width: 280;
  fontSize: 20;
`;

const Input = (props) => {
  return (
    <InputContainer>
      <Label>{props.name}</Label>
      <InputText></InputText>
    </InputContainer>
  )
}

export default Input;
