import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {LogNote} from '../../api'

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
  log: any;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;


const LogViewModal:FC<Props> = (props) => {

    const {visible, closeFunction, log} = props;

    useEffect(()=>{
        if(log.ID)
            LogNote.get(log.ID).then(res=>console.log(res.data));
    })

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
                        border: '2px',
                        borderRadius: '4px',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p>Log Details</p>
                    <p>{log.name}</p>
                    <button>Edit</button>
                    <button>Delete</button>
                    <button onClick={closeFunction}>Close</button>
                </div>
            </div>
        );
    else
        return null;

};

export default LogViewModal;