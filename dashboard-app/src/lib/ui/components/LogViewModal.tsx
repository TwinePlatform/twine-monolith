import React, { FC, useState, useEffect, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {LogNote} from '../../api'
import { DurationUnitEnum } from '../../../types';
// possible location import { Duration } from 'twine-util';

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
  onEdit: any;
  onDelete: any;
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
        if(data.result[0])
            setLogNote(data.result[0].notes);
    }
    

    useEffect(()=>{
        if(effectCount<3 && visible){
            getNote();
            setEffectCount(effectCount+1);
        }
    })

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
                    //justifyContent: 'center',
                    //alignItems: 'center',
                }}
                ref={wrapperRef}
                className="view-log-modal"
            >
                <div
                    style={{
                        backgroundColor: ColoursEnum.purple,
                        borderRadius: "8px 8px 0px 0px",
                    }}
                >
                <Heading2>TWINE</Heading2>
                </div>
                <p className = "modal-title">Volunteers Time</p>
                <div
                    style={{
                      /*  borderColor: ColoursEnum.mustard,
                        border: '2px',
                        borderRadius: '4px',*/
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        //marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    
                    {/* Refactor to group both sections into 1 class */}
                    <div className = "ProjectDetails">
                        {/* Probably need to find another wway to create spacing between letters */}
                        
                            <p><span  className = "SectionTitle">Volunteer</span> &nbsp; &nbsp; &nbsp; &nbsp;  {log.name}</p>
                            {/* <p>{log.name}</p> */}
                        
                           <hr className = "Section_Dividers" />
                            <p><span className = "SectionTitle">Project</span>  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.project}</p>
                            {/* <p>/p> */}
                            <hr  className = "Section_Dividers"/>
                       
                            <p><span className = "SectionTitle">Activity</span>  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.activity}</p>
                            {/* <p></p> */}

                            <hr className = "Section_Dividers" />
                        
                    </div>
                    
                    <div className = "DateTime">
                        
                            {/* Discuss posiblity of  Merging  Start and Finish Date/Time  */}
                           <p><span  className = "SectionTitle">Date </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.date}</p>
                          
                              <hr  className = "Section_Dividers"/>

                           
                            <p><span className = "SectionTitle">Start Time</span>  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; {log.startTime}</p>
                              
                              <hr  className = "Section_Dividers"/>
                       
                <p> <span className = "SectionTitle">Duration</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.hours}:{log.minutes<10?"0" + log.minutes: log.minutes}</p>

                              <hr className = "Section_Dividers" />
                          
                        
                    </div>

                    <div>
                       
                        <section className= "Note_Area">
                        {/* review  possible solution */}
                        <p>{logNote}</p>
                        </section>
                    </div>
                   
                   <div className="Duration">
                      <span><p> Member has volunteered  for  </p></span> <br />
                      <p> {log.hours} Hours {log.minutes} minutes</p> 

                   </div>

                    <div className ="ModalControls">
                         
                         <hr className = "BottomDivider" />
                        
                <button className = "EditLog" onClick={()=>props.onEdit()}> 
                <img className= "EditIcon"  src = {require('../../../assets/edit.svg')}  alt="Edit_Log" /> 
                &nbsp; Edit </button>

                        
                        <button className ="DeleteLog" onClick={()=>props.onDelete()}> 
                        
                        <img className= "DeleteIcon" src = {require('../../../assets/trash.svg')}  alt="Delete_Log" /> 
                        &nbsp; Delete </button>
                 
                    </div>
                </div>
            </div>
        );
    else
        return null;

};

export default LogViewModal;

