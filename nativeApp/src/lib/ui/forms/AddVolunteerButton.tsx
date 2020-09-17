import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Button as B, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { ColoursEnum } from '../colours';
import { FontsEnum } from "./../typography";


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
  width: 80;
  backgroundColor: ${ColoursEnum.darkGrey};;
  alignItems: center;
  justifyContent: center;
  fontSize:15;
  height:29;
  width: 145;
  borderRadius: 10;
  box-shadow: 2px 2px 2px ${ColoursEnum.grey};
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
    font-family: ${FontsEnum.medium};
    marginTop: 1;
    marginBottom: 1;
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
