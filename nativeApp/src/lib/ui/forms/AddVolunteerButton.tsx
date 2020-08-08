import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Button as B, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
    onPress: (values) => any;
    text: string;
}

/*
 * Styles
 */
const Submit = styled(B)`
  width: 100;
  backgroundColor: ${ColoursEnum.darkGrey};;
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  fontSize:15;
  height:26;
  width: 145;
`;

const VolButton = styled(B)`
  width: auto;
  backgroundColor: #B7B7B7;
  alignItems: center;
  height: 32;
  marginRight: 10;
`;

const SubmitText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 15;
    marginLeft: 5;
    marginRight: 15;
`;

const CloseIcon = styled(Icon)`
    marginRight: 5;
    fontSize: 15;
`;

/*
/*
 * Component
 */
export const AddVolunteerButton: FC<Props> = (props) => {
    const { onPress, text } = props;
    return (
        <Submit rounded
            onPress={onPress}
        >
            <SubmitText>{text}</SubmitText>
        </Submit>
    );
};

export const VolunteerButton: FC<Props> = (props) => {
    const { onPress, text } = props;
    return (
        <VolButton iconRight
            onPress={onPress}
        >
            <SubmitText>{text}</SubmitText>
            <CloseIcon type='AntDesign' name='close' />
        </VolButton>
    );
};
