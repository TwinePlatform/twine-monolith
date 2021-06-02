import React, { FC } from 'react';
import {Linking} from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Card as C } from 'native-base';

import { Heading2 as H2 } from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  isVisible: boolean;
  closeFunction: any;
}

/*
 * Styles
 */

const Container = styled.View`
  alignItems: center;
`;

const HeadingContainer = styled.View`
  backgroundColor: ${ColoursEnum.purple};
  borderTopLeftRadius: 10;
  borderTopRightRadius: 10;
`;

const Heading2 = styled(H2)`
  paddingHorizontal: 15;
  paddingTop: 10;
  marginBottom: 10;
  color: ${ColoursEnum.white};
`;

const Card = styled(C)`
  width: 85%;
  paddingBottom: 10;
  borderRadius: 10;
`;

const TextContainer = styled.View`
    paddingTop: 10;
    paddingBottom: 10;
    paddingLeft: 10;
    paddingRight: 10;
`;

const Text = styled.Text`
  textAlign: center;
  color: ${ColoursEnum.darkGrey};
  fontSize: 17;
`;

const LinkText = styled.Text`
    textAlign: center;
    color: ${ColoursEnum.purple};
    fontSize: 17;
    textDecorationLine: underline;
    marginBottom: 20;
`
/*
 * Component
 */


const SupportModal: FC<Props> = ({
  isVisible, closeFunction
}) => {

  return (
    <Modal isVisible={isVisible} onBackdropPress={()=>closeFunction()} onRequestClose={()=>closeFunction()}>
      <Container>
        <Card>
          <HeadingContainer>
            <Heading2>TWINE</Heading2>
          </HeadingContainer>
          <TextContainer>
            <Text>For more info on TWINE, click here:</Text>
            <LinkText
                onPress={()=>Linking.openURL('https://www.twine-together.com/')}
            >
            https://www.twine-together.com/
            </LinkText>
            <Text>For technical support with TWINE, enter your issue into a new ticket here:</Text>
            <LinkText
                onPress={()=>Linking.openURL('https://twineplatform.freshdesk.com/support/tickets/new')}
            >
            https://twineplatform.freshdesk.com/support/tickets/new
            </LinkText>
          </TextContainer>
        </Card>
      </Container>
    </Modal>
  )
};

export default SupportModal;