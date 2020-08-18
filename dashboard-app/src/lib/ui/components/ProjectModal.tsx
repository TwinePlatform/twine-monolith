import React, { FC, useState, useRef } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
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


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
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
        const result = await Project.add(projectName);
        console.log(result);
        //something about if result is good etc
        setProjectName("");
        setSuccessMessage("Successfully added project");
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
                    <p>New Project</p>
                    <input type="text" placeholder="Project Name" onChange={textHandler}/>
                    <button 
                        onClick={submit}
                        disabled={projectName.length < 1}
                    >
                        Create
                    </button>
                </div>
            </div>
        );
    else
        return null;

};

export default ProjectModal;