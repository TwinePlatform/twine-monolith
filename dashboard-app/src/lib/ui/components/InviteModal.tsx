import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
}

/*
 * Styles
 */
const Container = styled(Grid)`

`;


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.black};
`;
 /*
const Card = styled(C)`
  paddingHorizontal: 15;
  paddingTop: 15;
  paddingBottom: 10;
  borderRadius: 5;
`;*/

const ButtonContainer = styled(Grid)`
  justifyContent: center;
  flexDirection: row;
  marginTop: 10;
`;
/*
const ButtonText = styled.Text<{buttonType: 'cancel' | 'confirm' }>`
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
    <ButtonText buttonType={buttonType}>{ buttonType === 'cancel' ? 'Cancel' : 'Send'}</ButtonText>
  </StyledButton>
);*/

/*
 * Component
 */


const InviteModal:FC<Props> = (props) => {

    const {visible, closeFunction} = props;


    const [emailAddress, setEmailAddress] = useState("");
    const [subject, setSubject] = useState("Twine Sign Up");
    const [body, setBody] = useState("Dear Volunteer,\n\nI am inviting you to use the TWINE volunteering app.");

    const onSend = () => {
        const email = {
            address: emailAddress,
            subject: subject,
            body: body
        };

        console.log(email);
        //API.Invite.byEmail(email);
    }

    if(visible)
        return (
            <div
                style={{position: 'absolute', width: "50%", height: "50%", bottom: "25%", right: "25%"}}
            >
                <Heading2>TWINE</Heading2>
                <input type="text" placeholder="email address"></input>
                <button onClick={()=>closeFunction()}>close</button>
            </div>
        );
    else
        return null;

    /*
return(
  <Modal isVisible={isVisible}>
    <Card>
      <Heading2>{title}</Heading2>
      <Form>
      <Textarea rowSpan={1} bordered underline placeholder="address" value={emailAddress} onChangeText={text => setEmailAddress(text)}/>
      <Textarea rowSpan={1} bordered underline placeholder="subject" value={subject} onChangeText={text => setSubject(text)}/>
      <Textarea rowSpan={5} bordered underline value={body} onChangeText={text => setBody(text)}/>    
      </Form>
      <ButtonContainer>
        <Button onPress={onCancel} buttonType="cancel" />
        <Button onPress={()=>{
            onSend();
            onSendClose();
        }} buttonType="send" />
      </ButtonContainer>
    </Card>
  </Modal>
)*/

};

export default InviteModal;