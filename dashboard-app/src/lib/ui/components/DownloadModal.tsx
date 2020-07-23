import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
  file: string;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.black};
`;


const DownloadModal:FC<Props> = (props) => {

    const {visible, closeFunction, file} = props;

    const onSend = () => {
        console.log("email");
        //API.Invite.byEmail(email);
    }

    if(visible)
        return (
            <div
                style={{
                    position: 'fixed', 
                    width: "50%", 
                    height: "50%", 
                    bottom: "25%", 
                    right: "25%",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    zIndex: 3,
                }}
            >
                <Heading2>TWINE</Heading2>
                <p>Are you sure you would like to download?</p>
                <button onClick={()=>{closeFunction();console.log("downloading " + file)}}>upload file</button>
            </div>
        );
    else
        return null;

};

export default DownloadModal;