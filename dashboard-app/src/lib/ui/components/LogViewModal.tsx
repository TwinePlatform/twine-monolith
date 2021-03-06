import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2left } from './Headings';
import { ColoursEnum } from '../design_system';
import {LogNote} from '../../api'
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


const Heading2 = styled(H2left)`
  marginBottom: 20;
  padding: 10px;
  color: ${ColoursEnum.white};
`;

const LogViewModal:FC<Props> = (props) => {
    const {visible, closeFunction, log} = props;
    const [effectCount, setEffectCount] = useState(0);
    const [logNote, setLogNote] = useState("");

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, ()=>{closeFunction();setEffectCount(0);setLogNote("")});

    const getNote = useCallback( async () => {
        let {data} = await LogNote.get(log.ID);
        if(data.result[0])
            setLogNote(data.result[0].notes);
    },[log])

    useEffect(()=>{
        if(effectCount<3 && visible){
            getNote();
            setEffectCount(effectCount+1);
        }
    },[effectCount, visible, getNote])

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
                        
                           <p><span  className = "SectionTitle">Date </span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.date}</p>
                          
                              <hr  className = "Section_Dividers"/>

                 <p> <span className = "SectionTitle">Hours</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.hours}</p>

                              <hr className = "Section_Dividers" />
                          
                        
                       
                <p> <span className = "SectionTitle">Minutes</span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {log.minutes}</p>

                              <hr className = "Section_Dividers" />
                          
                        
                    </div>

                    <section className= "note-area">
                        <p>{logNote}</p>
                    </section>
                    
                   
                   <div className="duration">
                      <span><p> Member volunteered  for  </p></span> <br />
                      <p><span className="number">{log.hours}</span> Hours <span className="number">{log.minutes}</span> minutes</p> 
                   </div>
                   <hr className = "BottomDivider" />
                
                <div className ="ModalControls">
                         
                    <button className = "EditLog" onClick={()=>props.onEdit()}> 
                        <img className= "EditIcon"  src = {require('../../../assets/edit.svg')}  alt="Edit_Log" /> 
                        &nbsp; Edit 
                    </button>

                    <span className="vertical-divider"/>

                    <button className ="DeleteLog" onClick={()=>props.onDelete()}> 
                        
                        <img className= "DeleteIcon" src = {require('../../../assets/trash.svg')}  alt="Delete_Log" /> 
                        &nbsp; Delete 
                    </button>
                 
                    </div>
                </div>
            </div>
        );
    else
        return null;

};

export default LogViewModal;

