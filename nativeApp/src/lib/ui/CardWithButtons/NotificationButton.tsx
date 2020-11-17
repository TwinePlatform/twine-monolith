import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Button as B } from 'native-base';
import { StyleSheet } from "react-native";
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
    onPress: () => void;
    text: string;
    disabled: boolean;
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

const styles = StyleSheet.create({
    enable: {
        backgroundColor: ColoursEnum.purple
    },
    disable: {
        backgroundColor: ColoursEnum.grey
    }
});
/*

/*
 * Component
 */
const NotificationButton: FC<Props> = (props) => {
    const { onPress, text, disabled } = props;
    return (
        <Submit
            onPress={onPress}
            disabled={disabled}
            style={[disabled ? styles.disable : styles.enable]}
        >
            <SubmitText>{text}</SubmitText>
        </Submit>
    );
};

export default NotificationButton;
