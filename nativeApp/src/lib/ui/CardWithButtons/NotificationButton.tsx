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
  width: 20%;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  alignSelf: flex-end;
  justifyContent: center;
  marginTop: 0;
  marginBottom: 5;
  padding: 0px;
  border-radius: 10px;
  height: 25px;
`;

const SubmitText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 10;
`;
/*

/*
 * Component
 */
const NotificationButton: FC<Props> = (props) => {
    const { onPress, text } = props;
    return (
        <Submit
            onPress={onPress}
        >
            <SubmitText>{text}</SubmitText>
        </Submit>
    );
};

export default NotificationButton;
