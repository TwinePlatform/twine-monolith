import React, { FC, useState, useRef, useEffect } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {CommunityBusinesses, Project, Logs, LogNote,} from '../../api';

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

const getStringArray = (array: any) => {
    return array.map(item =>item.name)
}

const LogCreateModal:FC<Props> = (props) => {
    const {visible, closeFunction,} = props;

    const [projects, setProjects] = useState(["loading project"]);
    const [activities, setActivities] = useState(["loading activities"]);
    const [volunteers, setVolunteers] = useState(["loading volunteers"]);
    const [loading, setLoading] = useState(true);

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    useEffect(()=>{
        if(loading)
            getOptions();
    })

    const getOptions = async () => {
        const options = {
            projects: await Project.get(),
            activities: await CommunityBusinesses.getVolunteerActivities(),
            volunteers: await CommunityBusinesses.getVolunteers()
        }
        setProjects(getStringArray(options.projects.data.result));
        setActivities(getStringArray(options.activities.data.result));
        setVolunteers(getStringArray(options.activities.data.result));

        console.log(options);

        setLoading(false);
    }    

    const select = ()=>{
        console.log("selected")
    };

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
                        borderRadius: '4px',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '45px',
                        marginLeft: '75px',
                        marginRight: '75px',
                        padding: '12px',
                    }}
                >
                    <p>Add Time</p>
                {
                loading?
                    <p>loading...</p>
                :
                    <div>
                        <input type="text" placeholder="Name"/>
                        <input type="text" placeholder="Project"/>
                        <select id="Projects" name="Projects">
                            {projects.map(project=>
                                <option value={project}>{project}</option>)} 
                        </select>
                        <input type="text" placeholder="Activity"/>
                        <input type="text" placeholder="Date"/>
                        <input type="text" placeholder="Start Time"/>
                        <input type="text" placeholder="End Time"/>
                        <button onClick={select}>Create</button>
                    </div>
                    }
                </div>
            </div>
        );
    else
        return null;

};

export default LogCreateModal;