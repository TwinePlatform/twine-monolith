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

    const onDownload = () => {
        closeFunction();
        console.log("downloading " + file)
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
                    justifyContent: 'center'
                }}
            >
                <div
                    style={{
                        backgroundColor: ColoursEnum.purple
                    }}
                >
                <Heading2>TWINE</Heading2>
                </div>
                <p>Are you sure you would like to download?</p>
                <img
                    onClick={onDownload}
                    src={require('../../../assets/downloadbutton.png')}
                />
                <button onClick={onDownload}>upload file</button>
            </div>
        );
    else
        return null;

};

export default DownloadModal;