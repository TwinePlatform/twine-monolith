import React, { FC, useState, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H2left } from './Headings';
import { ColoursEnum } from '../design_system';

import {Invite} from '../../api';

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
  color: ${ColoursEnum.white};
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
 * Component
 */
const upperInviteText = "I am inviting you to use the TWINE volunteering app, please follow the instructions from the links provided to sign up.\n";
const lowerInviteText = "\nThanks! \n\nFellow Twine User";

const InviteModal:FC<Props> = (props) => {

    const {visible, closeFunction} = props;

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    const [emailAddress, setEmailAddress] = useState("");
    const [subject, setSubject] = useState("Twine Sign Up");
    const [upperBody, setUpperBody] = useState(upperInviteText);
    const [lowerBody, setLowerBody] = useState(lowerInviteText);

    const onSend = () => {
        const email = {
            "To": emailAddress,
            "email_subject": subject,
            "text_above_link": upperBody,
            "text_below_link": lowerBody,
        };

        console.log(email);
        closeFunction();
        Invite.byEmail(email);
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
                    boxShadow: '2px 3px 6px #00000029',
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
                    <input type="text" className="invite-input" onChange={e=>setEmailAddress(e.target.value)} value={emailAddress}></input>
                </div>
                <div className="invite-section">
                    <p className="invite-text">Subject:</p>
                    <input type="text" className="invite-input" onChange={e=>setSubject(e.target.value)} value={subject}></input>
                </div>
                <div className="invite-section" style={{display: "block"}}>
                <p className="invite-text">Dear Volunteer,</p>
                <br/>
                 <textarea 
                  className="invite-input" 
                  name="body" 
                  style={{width: "600px", height: "100px", resize: "none"}}
                  onChange={e=>setUpperBody(e.target.value)}
                  >
                    {upperBody}
                  </textarea>
                  <p className="invite-text">
                    iOS: <a href="https://www.apple.com">link to ios store</a>
                    <br/>
                    Android: <a href="https://play.google.com">link to play store</a> 
                  </p>
                  <textarea
                  className="invite-input" 
                  name="body" 
                  style={{width: "600px", height: "100px", resize: "none"}}
                  onChange={e=>setLowerBody(e.target.value)}
                  >
                    {lowerBody}
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