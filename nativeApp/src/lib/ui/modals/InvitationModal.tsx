import React, { FC, useState } from 'react';
import API from '../../../api';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Button as B, Card as C, Textarea as TA, Form } from 'native-base';
import { image } from 'react-native';
import { AddNote, Close } from '../AddNote';

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
}

/*
 * Styles
 */
const View = styled.View`
`;

const Heading2 = styled(H2)`
  paddingHorizontal: 15;
  paddingTop: 15;
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;

// const Card = styled(C)`
//   paddingHorizontal: 15;
//   paddingTop: 15;
//   paddingBottom: 10;
//   borderRadius: 5;
// `;

const Card = styled(C)`
  paddingBottom: 10;
  borderRadius: 10;
`;

const FormContainer = styled.View`
  paddingTop: 15;
  paddingHorizontal: 15;
`;

const FormInput = styled(TA)`
  borderRadius: 10;
  border: 2px solid;
`;

const ButtonContainer = styled.View`
  justifyContent: flex-end;
  alignItems: flex-end;
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

const HeadingContainer = styled.View`
  backgroundColor: ${ColoursEnum.purple};
  borderTopLeftRadius: 10;
  borderTopRightRadius: 10;
`;

/*
 * Component
 */


const InvitationModal: FC<Props> = ({
  isVisible, onSendClose, onCancel, awardBadge
}) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [subject, setSubject] = useState("Subject: Twine Sign Up");
  const [body, setBody] = useState("Dear Volunteer,\n\nI am inviting you to use the TWINE volunteering app,please follow the instructions from the links provided to sign up.");
  const [lowerbody, setLowerBody] = useState("iOS: 'link to iOS store' Android: 'link to app store'\n\n Thanks!\n\n Fellow Twine User");
  const link = "http:twinevolunteerapp.com";
  const onSend = () => {
    const email = {
      "To": emailAddress,
      "email_subject": subject,
      "text_above_link": body,
      "text_below_link": lowerbody,
    };
    API.Invite.byEmail(email);
  }

  return (

    <Modal isVisible={isVisible}>
      <Card>
        <HeadingContainer>
          <Heading2>TWINE</Heading2>
        </HeadingContainer>
        <FormContainer>
          <Form>
            <FormInput rowSpan={1} bordered underline placeholder="To:" value={emailAddress} onChangeText={text => setEmailAddress(text)} />
            <FormInput rowSpan={1} bordered underline placeholder="Subject: Twine Sign Up" value={subject} onChangeText={text => setSubject(text)} />
            <FormInput rowSpan={5} bordered underline value={body} onChangeText={text => setBody(text)} />
          </Form>
        </FormContainer>
        <ButtonContainer>
          {/* <Button onPress={onCancel} buttonType="cancel" /> */}
          <Close onPress={onCancel} />
          {/* <Button onPress={onPress} buttonType="send" /> */}
          <AddNote text='Send' onPress={async () => {
            onSend();
            onSendClose();
            //check if badge exist and call award modal
            const awardBadgeAPI = await API.Badges.awardInvite();
            if (awardBadgeAPI != null) {
              setTimeout(() => { awardBadge(true); }, 1000);
              setTimeout(() => { awardBadge(false); }, 3000);
            }
          }} />
        </ButtonContainer>
      </Card>
    </Modal>




  )
};

export default InvitationModal;
