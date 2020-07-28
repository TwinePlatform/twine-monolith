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


const UploadModal:FC<Props> = (props) => {

    const {visible, closeFunction, file} = props;

    const select = () => {
        if(document.getElementById('file-input'))
            document.getElementById('file-input').click();
    }

    const upload = () => {
        console.log("uploading " + file)
        //API.Invite.byEmail(email);
    }

    const handleUpload = (e) => {
        if(e.target.files[0])
            console.log(e.target.files[0]);
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
                    boxShadow: '2px 3px 6px #00000029',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: ColoursEnum.purple,
                        borderRadius: "8px 8px 0px 0px",
                    }}
                >
                <Heading2>TWINE</Heading2>
                </div>
                <div
                    style={{
                        borderColor: ColoursEnum.mustard,
                        borderWidth: '2px',
                        borderRadius: '4px',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p>Upload File Here</p>
                    <button onClick={select()}>Select</button>
                    <input id="file-input" type="file" name="name" style={{display: 'none'}}
                        onChange={e=>handleUpload(e)}
                    />
                </div>
                <img
                    src={require('../../../assets/uploadbutton.png')}
                    onClick={()=>{closeFunction();upload()}}
                />
            </div>
        );
    else
        return null;

};

export default UploadModal;