import React, { FC } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Button as B, Card as C, CardItem as CI } from 'native-base';

import { Heading2 as H2, FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
    isVisible: () => void;
    onConfirm: () => void;
    onCancel: () => void;
}

/*
 * Styles
 */
const HeaderContainer = styled.View`
    width: 100%;
    alignItems: flex-start;
    background-color: ${ColoursEnum.purple};
    color: ${ColoursEnum.white};
    borderTopLeftRadius: 10;
    borderTopRightRadius: 10;
`;

const Heading2 = styled(H2)`
  color: ${ColoursEnum.white};
  marginTop: 15;
  fontSize: 25;
  fontFamily:${FontsEnum.regular};
  marginBottom: 15;
  marginLeft: 20;
  width: 335;
`;

const Card = styled.View`
  paddingHorizontal: 15;
  paddingTop: 15;
  paddingBottom: 10;
  borderBottomLeftRadius: 10;
  borderBottomRightRadius: 10;
  background-color: ${ColoursEnum.white};
  alignItems: center;
  justifyContent: center;
  width: 100%;
`;

const Text = styled.Text`
  fontSize: 19;
  color: ${ColoursEnum.orangeRed};
  fontFamily:${FontsEnum.regular};
  marginBottom: 35;
`;

const ButtonContainer = styled.View`
    alignItems: center;
    justifyContent: center;
`;

const Submit = styled(B)`
  width: 237;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginBottom: 24;
`;

const SubmitText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 18;
`;

/*
 * Component
 */
const LogOutModal: FC<Props> = ({
    isVisible, onConfirm, onCancel
}) => (
        <Modal isVisible={isVisible}>
            <HeaderContainer>
                <Heading2>TWINE</Heading2>
            </HeaderContainer>
            <Card>

                <Text>Are you sure you want to log out?</Text>
                <ButtonContainer>
                    <Submit onPress={onConfirm}>
                        <SubmitText>YES</SubmitText>
                    </Submit>
                    <Submit onPress={onCancel}>
                        <SubmitText>NO</SubmitText>
                    </Submit>
                </ButtonContainer>
            </Card>
        </Modal>
    );

export default LogOutModal;
