import React, { FC, useState, useRef, useEffect,useCallback } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2left } from './Headings';
import { ColoursEnum } from '../design_system';
import {CommunityBusinesses, Project, Logs, LogNote} from '../../api';
import NoteModal from './NoteModal';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
  logToEdit: any;
}

/*
 * Styles
 */


const Heading2 = styled(H2left)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
  padding: 10px;
`;

const getStringArray = (array: any[]) => {
    return array.map(item =>item.name)
}

const getSelected = (e: any) => e.value;

const getDate = (date: any, startTime: any) => {

    try{
        let startedAt = new Date(date +'T'+startTime);
        return startedAt;
    }
    catch{
        //console.log("not good");
        return new Date()
    }
}

const isNotZero = (duration: any) => {
    if(duration.hours === 0 && duration.minutes === 0)
        return false;
    return true;
}

const zeroToNine = [...Array(10).keys()];
const zeroToFiftyNine = [...Array(60).keys()];

const LogEditModal:FC<Props> = (props) => {
    const {visible, closeFunction, logToEdit} = props;

    const [projects, setProjects] = useState(["loading project"]);
    const [activities, setActivities] = useState(["loading activities"]);
    const [volunteers, setVolunteers] = useState([{id:0 , name:"loading volunteers"}]);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [date, setDate] = useState(logToEdit.date);
    const startTime = new Date().toISOString().slice(11,16);
    const [duration, setDuration] = useState({
        hours: logToEdit.hours,
        minutes:logToEdit.minutes,
        seconds:0
    })

    const[errorMessage, setErrorMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const[noteModalVisible, setNoteModalVisible] = useState(false);
    const[note, setNote] = useState("");

    const getIdFromName = (name: string) => {
        const volunteer = volunteers.find(volunteer => volunteer.name === name);

        return volunteer != null? volunteer.id : 0;
    }

    const [log, setLog] = useState({
        userId: getIdFromName(logToEdit.name),
        activity: logToEdit.activity,
        project: logToEdit.project,
        duration: {hours: logToEdit.hours, minutes: logToEdit.minutes, seconds: 0},
        startedAt: getDate(date,startTime),
    })

    //close modal if clicked outside of it
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, ()=>{closeFunction();setLoading(true)});

    useEffect(()=>{
        if(loading){
            getOptions();
        }
            
        if(!loading && document.getElementById('Log Form')){
            let potentialLog = {
                userId: parseInt(getSelected(document.getElementById('Volunteer'))),
                activity: getSelected(document.getElementById('Activity')),
                project: getSelected(document.getElementById('Project')),
                duration: duration,
                startedAt: getDate(date,startTime),
            };

            //validation code
            if(new Date(potentialLog.startedAt) && isNotZero(potentialLog.duration)){
                setLog(potentialLog);
                setValid(true);
            }
        }
    },[loading, duration, date, startTime])

    const getNote = useCallback(async () => {
        let {data} = await LogNote.get(logToEdit.ID);
        if(data.result[0] != null)
            if(data.result[0].notes != null)
                setNote(data.result[0].notes);
    },[logToEdit]);

    useEffect(()=>{
        setDate(logToEdit.date);
        getNote();
    },[logToEdit,getNote])

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

        if(event.target.id === "minutes")
            setDuration({
                hours: duration.hours,
                minutes: event.target.value,
                seconds: duration.seconds
            })
        if(event.target.id === "hours")
            setDuration({
                hours: event.target.value,
                minutes: duration.minutes,
                seconds: duration.seconds
            })
    }

    const submit = ()=>{
        console.log(log)

        const newValues = {
            activity: log.activity,
            duration: log.duration,
            startedAt: log.startedAt,
            project: log.project,
        };

        try{
            Logs.update(log.userId,logToEdit.ID,newValues)
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
        setSuccessMessage("Log edited!");
        setTimeout(()=>{setSuccessMessage("");closeFunction()},1000);
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
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                ref={wrapperRef}
                className="log-modal"
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
                initialNote={note}
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
                        padding: '10px',
                    }}
                >
                    <p className = "modal-title">Edit Time</p>
                {
                loading?
                    <p>loading...</p>
                :
                    <div id="Log Form" className="log-create-form">
                        <div className="log-create-column">
                            <div className="log-create-section">
                                <span  className = "section-title-create">Volunteer</span>
                                <select id="Volunteer" name="Volunteer" className="log-create-select">
                                    {volunteers.map(volunteer=>
                                        <option value={volunteer.id} selected={volunteer.name===logToEdit.name? true: false}>{volunteer.name}</option>)} 
                                </select>
                            </div>
                        <hr className = "Section_Dividers" />
                        <div className="log-create-section">
                        <span  className = "section-title-create">Project</span>
                        <select id="Project" name="Project" className="log-create-select">
                            {projects.map(project=>
                                <option value={project} selected={project===logToEdit.project? true: false}>{project}</option>)} 
                        </select>
                        </div>
                        <hr className = "Section_Dividers" />
                        <div className="log-create-section">
                        <span  className = "section-title-create">Activity</span>
                        <select id="Activity" name="Activity" className="log-create-select">
                            {activities.map(activity=>
                                <option value={activity} selected={activity===logToEdit.activity? true: false}>{activity}</option>)} 
                        </select>
                        </div>
                        <hr className = "Section_Dividers" />
                        </div>
                        <div className="log-create-column">
                        <div className="log-create-section">
                        <span  className = "section-title-create">Date</span>
                        <input type="date" id="Date" value={date}  className="log-create-select"
                            onChange={(e)=>setDate(e.target.value)}
                            //max={todaysDate}
                        />
                        </div>
                        <hr className = "Section_Dividers" />
                        <div className="log-create-section">
                        <span  className = "section-title-create">Hours</span>
                        <select id="hours" name="Hours" onChange={e=>changeDuration(e)} className="log-create-select">
                            {zeroToNine.map(time=>
                                <option value={time} selected={time === logToEdit.hours}>{time}</option>)} 
                        </select>
                        </div>
                        <hr className = "Section_Dividers" />
                        <div className="log-create-section">
                        <span  className = "section-title-create">Minutes</span>
                        <select id="minutes" name="Minutes"  className="log-create-select"
                        onChange={e=>changeDuration(e)}>
                            {zeroToFiftyNine.map(time=>
                                <option value={time}selected={time === logToEdit.minutes}>{time}</option>)} 
                        </select>
                        </div>
                        <hr className = "Section_Dividers" />
                        </div>
                    </div>
                    }
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <button 
                        className="add-note-button"
                        onClick={()=>setNoteModalVisible(true)}>Add Note</button>
                    </div>
                    <div className="duration-create">
                        <span><p> Member volunteered  for  </p></span> <br />
                        <p><span className="number">{log.duration.hours}</span> Hours <span className="number">{log.duration.minutes}</span> minutes</p> 
                    </div>  
                    <div style={{display: "flex", justifyContent: "center"}}>
                    <button onClick={submit}
                    className="create-log-button"
                        disabled={!valid}
                    >EDIT TIME</button>
                    <p>{errorMessage}</p>
                    </div>
                </div>
            </div>
        );
    else
        return null;

};

export default LogEditModal;