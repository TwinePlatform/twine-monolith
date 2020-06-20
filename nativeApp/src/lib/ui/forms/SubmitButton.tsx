import React, { FC } from 'react';
import styled from 'styled-components/native';
// import { Button as B } from 'native-base';
import { TouchableOpacity } from 'react-native';

import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
  onPress: () => void;
  text: string;
}

/*
 * Styles
 */
const Submit = styled.View`
  width: 100%;
  height: 48px;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  marginBottom: ${props => props.marginBottom || 40};
  border-radius: 5px;
  box-shadow: 0px 2px 3px #33333333;
  shadow-radius: 3;
  elevation: 1;
  shadow-opacity: 1;
`;

const SubmitText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 15;
`;
/*

/*
 * Component
 */
const SubmitButton: FC<Props> = (props) => {
  const { onPress, marginBottom, text } = props;
  return (
    <TouchableOpacity
      onPress={() => { onPress() }}
    >
      <Submit marginBottom={marginBottom}>
        <SubmitText >{text}</SubmitText>
      </Submit>
    </TouchableOpacity>
  );
};

export default SubmitButton;
