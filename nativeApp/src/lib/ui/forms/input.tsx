import React from 'react';
import styled from 'styled-components/native'
import { FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

const InputContainer = styled.View`
  flexDirection: row;
  alignItems: center;
  marginTop: 20;
  marginBottom: 20;
  paddingBottom: 10;
  borderBottomWidth: 1;
  borderColor: ${ColoursEnum.darkGrey}
`;

const ChildBox = styled.View`
`;

const InputText = styled.TextInput`
  fontFamily: ${FontsEnum.regular};
  marginLeft: 10;
  width: 250;
  fontSize: 20;
`;

const Input = (props) => {
  const { children: icon, name, ...rest} = props;
  return (
    <InputContainer>
      <ChildBox>
        {icon}
      </ChildBox>
      <InputText placeholder={props.name} {...rest}></InputText>
    </InputContainer>
  )
}

export default Input;
