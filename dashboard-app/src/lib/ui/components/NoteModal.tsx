import React, { FC, useState, useRef} from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2left } from './Headings';
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


const Heading2 = styled(H2left)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
  padding: 10px;
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
                    height: "30%", 
                    bottom: "30%", 
                    right: "30%",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    zIndex: 3,
                    boxShadow: '2px 3px 6px #00000029',
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
                <div style={{display: 'flex', justifyContent: 'space-between' ,padding: '10px'}}>
                    <input 
                    type="text" 
                    placeholder="Enter note..." 
                    value={potentialNote}
                    onChange={e=>setPotentialNote(e.target.value)}/>
                    <br/>
                    <button className="add-note-button" onClick={submit}>Confirm Note</button>
                </div>
            </div>
        );
    else
        return null;

};

export default NoteModal;