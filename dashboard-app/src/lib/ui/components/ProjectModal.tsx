import React, { FC, useState, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2left } from './Headings';
import { ColoursEnum } from '../design_system';
import {Project} from '../../api';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
}

/*
 * Styles
 */


const Heading2 = styled(H2left)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
  padding: 10px;
`;


const ProjectModal:FC<Props> = (props) => {
    const [projectName, setProjectName] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const {visible, closeFunction} = props;

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    const textHandler = (e: any) => {
        console.log(e.target.value);
        setProjectName(e.target.value);
    }

    const submit = async () => {
        const {data} = await Project.add(projectName);
        if(data.result.id){
            setProjectName("");
            setSuccessMessage("Successfully added project");
        }
    }

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
                <div style={{display: 'flex', padding: '4px 30px'}}>
                <p className = "modal-title">Add Project</p>
                <br/>
                <input className="log-create-select" value={projectName} type="text" placeholder="Project Name" onChange={textHandler}/>
                <hr className = "Section_Dividers"/>
                <br/>
                <button 
                    onClick={submit}
                    disabled={projectName.length < 1}
                    className="create-log-button"
                    style={{justifySelf: 'center', alignSelf: 'center'}}
                >
                    SAVE
                </button>
                <p>{successMessage}</p>
                </div>
            </div>
        );
    else
        return null;

};

export default ProjectModal;