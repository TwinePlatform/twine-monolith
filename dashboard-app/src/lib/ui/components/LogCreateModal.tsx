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

const getStringArray = (array: any[]) => {
    return array.map(item =>item.name)
}

const getSelected = (e: any) => e.value;

const getDuration = (startTime: any, endTime: any) => {
    return {hours: 0, minutes: 0, seconds: 0}
}

const getDate = (dateElement: any, startTimeElement: any) => {
    return new Date()
}

const getNote = (e: any) => e.value? e.value : ""

const LogCreateModal:FC<Props> = (props) => {
    const {visible, closeFunction,} = props;

    const [projects, setProjects] = useState(["loading project"]);
    const [activities, setActivities] = useState(["loading activities"]);
    const [volunteers, setVolunteers] = useState([{id:0 , name:"loading volunteers"}]);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);

    const [log, setLog] = useState({
        userID: 0,
        activity: "",
        project: "",
        duration: {hours: 0, minutes: 0, seconds: 0},
        startedAt: new Date(),
        notes: ""
    })

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    useEffect(()=>{
        if(loading)
            getOptions();
        if(!loading && document.getElementById('Log Form')){
            let potentialLog = {
                userID: getSelected(document.getElementById('Volunteer')),
                activity: getSelected(document.getElementById('Activity')),
                project: getSelected(document.getElementById('Project')),
                duration: getDuration(document.getElementById('Start Time'),document.getElementById('End Time')),
                startedAt: getDate(document.getElementById("Date"),document.getElementById('Start Time')),
                notes: getNote(document.getElementById('Note')),
            };

            console.log(potentialLog);
            //validation code
            if(true){
                setLog(potentialLog);
                setValid(true);
            }
            
        }
    })

    const getOptions = async () => {
        const options = {
            projects: await Project.get(),
            activities: await CommunityBusinesses.getVolunteerActivities(),
            volunteers: await CommunityBusinesses.getVolunteers()
        }
        setProjects(getStringArray(options.projects.data.result));
        setActivities(getStringArray(options.activities.data.result));
        setVolunteers(options.volunteers.data.result);

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
                    <div id="Log Form">
                        <select id="Volunteer" name="Volunteer">
                            {volunteers.map(volunteer=>
                                <option value={volunteer.id}>{volunteer.name}</option>)} 
                        </select>
                        <select id="Project" name="Project">
                            {projects.map(project=>
                                <option value={project}>{project}</option>)} 
                        </select>
                        <select id="Activity" name="Activity">
                            {activities.map(activity=>
                                <option value={activity}>{activity}</option>)} 
                        </select>
                        <input type="date" id="Date" value={new Date().toLocaleDateString()}
                            max={new Date().toLocaleDateString()}
                        />
                        <input type="time" id="Start Time" value={new Date().toTimeString()}/>
                        <input type="time" id="End Time" value={new Date().toTimeString()}
                            max={new Date().toTimeString()}
                        />
                        <input type="text" id="Note" placeholder="Notes"/>
                        <button onClick={select}
                        disabled={!valid}
                        >Create</button>
                    </div>
                    }
                </div>
            </div>
        );
    else
        return null;

};

export default LogCreateModal;