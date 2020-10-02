import React, { FC, useState, useRef, useEffect } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
  setNote: any;
  initialNote?: string;
}

/*
 * Styles
 */


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;

const NoteModal:FC<Props> = (props) => {
    const {visible, closeFunction, setNote, initialNote} = props;

    const [potentialNote, setPotentialNote] = useState(initialNote ? initialNote : "");
   
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    const submit = ()=>{
        try{
            setNote(potentialNote);
            closeFunction();
        }
        catch(error){
            console.log("error");
            console.log(error);
        }
    };

    if(visible)
        return (
            <div
                style={{
                    position: 'fixed', 
                    width: "30%", 
                    height: "30%", 
                    bottom: "45%", 
                    right: "45%",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    zIndex: 3,
                    boxShadow: '2px 3px 6px #00000029',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                ref={wrapperRef}
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
                        borderRadius: '4px',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <input type="text" placeholder="Enter note..." onChange={e=>setPotentialNote(e.target.value)}/>
                    <button onClick={submit}>Add Note</button>
                </div>
            </div>
        );
    else
        return null;

};

export default NoteModal;