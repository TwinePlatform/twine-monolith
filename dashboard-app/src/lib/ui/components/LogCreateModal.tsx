import React, { FC, useState, useRef, useEffect } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {CommunityBusinesses, Project, Logs, LogNote,} from '../../api';
import NoteModal from './NoteModal';
import { duration } from 'moment';
import DataTable from '../../../features/dashboard/components/DataTable';

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

const getDate = (dateElement: any, startTimeElement: any) => {

    try{
        let date = new Date(
            parseInt(dateElement.value.slice(0,4)),
            parseInt(dateElement.value.slice(5,7)) - 1,
            parseInt(dateElement.value.slice(8,10)),
            startTimeElement.value.slice(0,2),
            startTimeElement.value.slice(3,5),
        )
        return date;
    }
    catch{
        console.log("not good");
        return new Date()
    }
}

const isNotZero = (duration: any) => {
    if(duration.hours == 0 && duration.minutes == 0)
        return false;
    return true;
}
/*
const zeroToNine = [...Array(10).keys()].map((_, i) => ({ id: i, name: `${parseInt(i)}` }));
const zeroToFiftyNine = [...Array(60).keys()].map((_, i) => ({ id: i, name: `${parseInt(i)}` }));

*/
const zeroToNine = [...Array(10).keys()]
const zeroToFiftyNine = [...Array(60).keys()]


const LogCreateModal:FC<Props> = (props) => {
    const {visible, closeFunction,} = props;

    const [projects, setProjects] = useState(["loading project"]);
    const [activities, setActivities] = useState(["loading activities"]);
    const [volunteers, setVolunteers] = useState([{id:0 , name:"loading volunteers"}]);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const now = new Date();
    const [date, setDate] = useState(now.toISOString().slice(0,10));
    const [startTime, setStartTime] = useState(now.getHours() + ":" + now.getMinutes());
    const [duration, setDuration] = useState({
        hours:0,
        minutes:0,
        seconds:0
    })

    const[errorMessage, setErrorMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const[noteModalVisible, setNoteModalVisible] = useState(false);
    const[note, setNote] = useState("");

    const [log, setLog] = useState({
        userId: 0,
        activity: "",
        project: "",
        duration: duration,
        startedAt: new Date(),
    })

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    useEffect(()=>{
        if(loading)
            getOptions();
        if(!loading && document.getElementById('Log Form')){
            let potentialLog = {
                userId: parseInt(getSelected(document.getElementById('Volunteer'))),
                activity: getSelected(document.getElementById('Activity')),
                project: getSelected(document.getElementById('Project')),
                duration: duration,
                startedAt: getDate(document.getElementById("Date"),document.getElementById('Start Time')),
            };

            console.log(new Date(potentialLog.startedAt));
            console.log(isNotZero(potentialLog.duration));
            //validation code
            if(new Date(potentialLog.startedAt) && isNotZero(potentialLog.duration)){
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

        setLoading(false);
    }   

    const changeDuration = (event: any) => {
        console.log(event.target)

        if(event.target.id == "minutes")
            setDuration({
                hours: duration.hours,
                minutes: event.target.value,
                seconds: duration.seconds
            })
        if(event.targetid == "hours")
            setDuration({
                hours: event.target.value,
                minutes: duration.minutes,
                seconds: duration.seconds
            })
    }

    const submit = ()=>{
        try{
            Logs.add(log)
            .then(result=>{
                const {activity, project, startedAt } = result.data.result;
                const LogID = result.data.result.id;
                LogNote.update(note,LogID,activity,project,startedAt).then(result=>console.log(result))
                }
            );
            showSuccessMessage();
        }
        catch(error){
            console.log("error");
            console.log(error);
            setErrorMessage(error);
        }
    };

    const showSuccessMessage = ()=>{
        setSuccessMessage("Log created!");
        setTimeout(()=>{setSuccessMessage("")},1000);
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
                <h1
                    style={{
                        position: 'fixed', bottom: '50%', zIndex: 4, color: ColoursEnum.purple,
                        textAlign: 'center', left: '50%'
                    }}
                >{successMessage}</h1>
                <NoteModal
                visible={noteModalVisible}
                setNote={setNote}
                closeFunction={()=>setNoteModalVisible(false)}
                />
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
                        <input type="date" id="Date" value={date}
                            onChange={(e)=>setDate(e.target.value)}
                            //max={todaysDate}
                        />
                        <input type="time" id="Start Time" value={startTime}
                        onChange={(e)=>setStartTime(e.target.value)}
                        />
                        <select id="hours" name="Hours" onChange={changeDuration}>
                            {zeroToNine.map(time=>
                                <option value={time}>{time}</option>)} 
                        </select>
                        <select id="minutes" name="Minutes" onChange={changeDuration}>
                            {zeroToFiftyNine.map(time=>
                                <option value={time}>{time}</option>)} 
                        </select>
                        <button onClick={()=>setNoteModalVisible(true)}>Add Note</button>
                        <button onClick={submit}
                        disabled={!valid}
                        >Create</button>
                        <p>{errorMessage}</p>
                    </div>
                    }
                </div>
            </div>
        );
    else
        return null;

};

export default LogCreateModal;