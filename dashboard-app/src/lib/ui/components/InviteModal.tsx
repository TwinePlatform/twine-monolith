import React, { FC, useState, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H2left } from './Headings';
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


const Heading2 = styled(H2left)`
  marginBottom: 20;
  color: ${ColoursEnum.black};
  padding: 10px;
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

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);


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
        closeFunction();
        //API.Invite.byEmail(email);
    }

    if(visible)
        return (
            <div
                style={{
                    position: 'fixed', 
                    bottom: "50%", 
                    right: "50%",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    zIndex: 3,
                }}
                ref={wrapperRef}
                className="log-modal"
            >
                <div
                    style={{
                        backgroundColor: ColoursEnum.purple,
                        borderRadius: "8px 8px 0px 0px",
                    }}
                >
                <Heading2>TWINE</Heading2>
                </div>
                <div className="invite-section">
                    <p className="invite-text">To:</p>
                    <input type="text" className="invite-input" onChange={e=>setEmailAddress(e.target.value)}>{emailAddress}</input>
                </div>
                <div className="invite-section">
                    <p className="invite-text">Subject:</p>
                    <input type="text" className="invite-input" onChange={e=>setSubject(e.target.value)}>{subject}</input>
                </div>
                <div className="invite-section">
                  <textarea className="invite-input" name="body" 
                  //cols="80" rows="15"
                  onChange={e=>setBody(e.target.value)}
                  >
                    {body}
                  </textarea>
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <button onClick={onSend} className="send-email-button">Send</button>
                </div>
            </div>
        );
    else
        return null;

};

export default InviteModal;