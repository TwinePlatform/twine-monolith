import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Button as B } from 'native-base';

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
const Submit = styled(B)`
  width: 100%;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  marginBottom: 40;
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
  const { onPress, text } = props;
  return (
    <Submit
      onPress={onPress}
    >
      <SubmitText>{text}</SubmitText>
    </Submit>
  );
};

export default SubmitButton;