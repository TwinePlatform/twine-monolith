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
  filename: string;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
    marginBottom: 20;
    color: ${ColoursEnum.white};
`;


const DownloadModal:FC<Props> = (props) => {

    const {visible, closeFunction, filename} = props;

    const onDownload = () => {
        closeFunction();
        console.log("downloading " + filename)
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
                <p
                    style={{
                        fontFamily: 'roboto',
                        fontSize: '20px'
                    }}
                >Are you sure you would like to download?</p>
                <a href={"/downloads/" + filename} download>
                <img
                    onClick={onDownload}
                    src={require('../../../assets/downloadbutton.png')}
                />
                </a>
            </div>
        );
    else
        return null;

};

export default DownloadModal;