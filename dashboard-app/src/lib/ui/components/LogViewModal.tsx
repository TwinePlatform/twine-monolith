import React, { FC, useState, useEffect, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {LogNote} from '../../api'

//Delete Log = require(path to Delete Icon)
//Edit Log = require(path to Edit Icon)
//
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

const timeMinusHours = (time: string, hours: number) => {
    let newHour = parseInt(time.slice(0,2)) - hours;

    return newHour + time.slice(2);
}

const LogViewModal:FC<Props> = (props) => {
    const {visible, closeFunction, log} = props;
    const [effectCount, setEffectCount] = useState(0);
    const [logNote, setLogNote] = useState("");

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, ()=>{closeFunction();setEffectCount(0);setLogNote("")});

    const getNote = async () => {
        let {data} = await LogNote.get(log.ID);
        console.log(data.result[0].notes)
        if(data.result[0])
            setLogNote(data.result[0].notes);
    }
    
    useEffect(()=>{
        if(effectCount<3 && visible){
            getNote();
            setEffectCount(effectCount+1);
        }
    })

    // let DeleteLogIcon = require ("../../assets/trash.svg");

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
                      /*  borderColor: ColoursEnum.mustard,
                        border: '2px',
                        borderRadius: '4px',*/
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p className = "modalTitle">Volunteers Time</p>
                    
                    <div className = "ProjectDetails">
                        
                            <p>Volunteer : {log.name}</p>
                            {/* <p>{log.name}</p> */}
                        
                        
                            <p>Project : {log.project}</p>
                            {/* <p>/p> */}
                      
                       
                            <p>Activity : {log.activity}</p>
                            {/* <p></p> */}
                        
                    </div>
                    
                    <div className = "DateTime">
                        
                            {/* Discuss posiblity of  Merging  Start and Finish Date/Time  */}
                            <p>Date: {log.date}</p>
                          
                      
                            <p>Start Time: {timeMinusHours(log.endTime,log.hours)}</p>
                           
                       
                            <p>End Time: {log.endTime}</p>
                          
                        
                    </div>

                    <div>
                        {/* Note textarea goes here  */}
                        {/* review  possible solution */}
                        <p>{logNote}</p>
                    </div>
                   
                   

                    <div className ="ModalControls">
                         
                         <hr className = "BottomDivider" />
                        
                <button className = "EditLog"> 
                <img className= "EditIcon" src = "../../assets/trash.svg"  alt="Edit_Log" /> 
                 Edit </button>

                        
                        <button className ="DeleteLog"> 
                        {/* Push failed for some reason likely somethinng to do with  the way I improrted the image*/}
                        <img className= "DeleteIcon" src = "../../assets/edit.svg"  alt="Delete_Log" /> 
                        Delete </button>
                   {/*  */}
                   {/* dashboard-app\src\assets\trash.svg */}
                    </div>
                </div>
            </div>
        );
    else
        return null;

};

export default LogViewModal;

