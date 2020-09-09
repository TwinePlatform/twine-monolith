import React, { FC, useState } from 'react';
import API from '../../../api';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Button as B, Card as C, Textarea, Form } from 'native-base';

import { Heading2 as H2, FontsEnum } from '../typography';
import { ColoursEnum } from '../colours';

/*
 * Types
 */
type Props = {
  isVisible: boolean;
  onSendClose: () => void;
  onCancel: () => void;
  awardBadge: (awardBadgeState) => boolean;
  title: string;
}

/*
 * Styles
 */
const View = styled.View`
`;

const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.black};
`;

const Card = styled(C)`
  paddingHorizontal: 15;
  paddingTop: 15;
  paddingBottom: 10;
  borderRadius: 5;
`;

const ButtonContainer = styled.View`
  justifyContent: center;
  flexDirection: row;
  marginTop: 10;
`;

const ButtonText = styled.Text<{ buttonType: 'cancel' | 'confirm' }>`
  letterSpacing: 1.2;
  fontFamily:${FontsEnum.medium} 
  color: ${({ buttonType }) => (buttonType === 'cancel' ? ColoursEnum.darkGrey : ColoursEnum.purple)};
  fontSize: 18;
  `;

const StyledButton = styled(B)`
  width: 100;
  justifyContent: center;
`;

const Button = ({ onPress, buttonType }) => (
  <StyledButton transparent onPress={onPress}>
    <ButtonText buttonType={buttonType}>{buttonType === 'cancel' ? 'Cancel' : 'Send'}</ButtonText>
  </StyledButton>
);

/*
 * Component
 */


const InvitationModal: FC<Props> = ({
  isVisible, onSendClose, onCancel, awardBadge, title,
}) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [subject, setSubject] = useState("Twine Sign Up");
  const [body, setBody] = useState("Dear Volunteer,\n\nI am inviting you to use the TWINE volunteering app.");

  const onSend = () => {
    // const email = {
    //   address: emailAddress,
    //   subject: subject,
    //   body: body
    // };
    // API.Invite.byEmail(email);
  }

  return (

    <Modal isVisible={isVisible}>
      <Card>
        <Heading2>{title}</Heading2>
        <Form>
          <Textarea rowSpan={1} bordered underline placeholder="address" value={emailAddress} onChangeText={text => setEmailAddress(text)} />
          <Textarea rowSpan={1} bordered underline placeholder="subject" value={subject} onChangeText={text => setSubject(text)} />
          <Textarea rowSpan={5} bordered underline value={body} onChangeText={text => setBody(text)} />
        </Form>
        <ButtonContainer>
          <Button onPress={onCancel} buttonType="cancel" />
          {/* <Button onPress={onPress} buttonType="send" /> */}
          <Button onPress={async () => {
            onSend();
            onSendClose();
            //check if badge exist and call award modal
            const awardBadgeAPI = await API.Badges.awardInvite();
            if (awardBadgeAPI != null) {
              setTimeout(() => { awardBadge(true); }, 1000);
              setTimeout(() => { awardBadge(false); }, 3000);
            }
          }} buttonType="send" />
        </ButtonContainer>
      </Card>
    </Modal>




  )
};

export default InvitationModal;
