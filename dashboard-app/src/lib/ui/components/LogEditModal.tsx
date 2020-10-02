import React, { FC, useState, useRef, useEffect } from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { ColoursEnum } from '../design_system';
import {CommunityBusinesses, Project, Logs, LogNote, Users} from '../../api';
import NoteModal from './NoteModal';
import { duration } from 'moment';
import DataTable from '../../../features/dashboard/components/DataTable';

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


const Heading2 = styled(H2)`
  marginBottom: 20;
  color: ${ColoursEnum.white};
`;

const getStringArray = (array: any[]) => {
    return array.map(item =>item.name)
}

const getSelected = (e: any) => e.value;

const getDuration = (startTimeElement: any, endTimeElement: any) => {
    const startTime = startTimeElement.value;
    const endTime = endTimeElement.value;

    //assuming same day, which you kind of
    const hours = parseInt(endTime.slice(0,2)) - parseInt(startTime.slice(0,2));
    const minutes = 0;
    const seconds = 0;

    return {hours, minutes, seconds}
}

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

const LogEditModal:FC<Props> = (props) => {
    const {visible, closeFunction, logToEdit} = props;

    const [projects, setProjects] = useState(["loading project"]);
    const [activities, setActivities] = useState(["loading activities"]);
    const [volunteers, setVolunteers] = useState([{id:0 , name:"loading volunteers"}]);
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [date, setDate] = useState(logToEdit.date);
    const [startTime, setStartTime] = useState(logToEdit.endTime);
    const [endTime, setEndTime] = useState(logToEdit.endTime);

    const[errorMessage, setErrorMessage] = useState("");
    const[successMessage, setSuccessMessage] = useState("");

    const[noteModalVisible, setNoteModalVisible] = useState(false);
    const[note, setNote] = useState("");

    const[myUserId, setMyUserId] = useState(0);

    /*
    ID: 6791
activity: "Cafe/Catering"
date: "2020-09-30"
endTime: "14:16"
hours: 4
name: "User 219"
project: "Test"
    */
    const getIdFromName = (name: string) => {
        const volunteer = volunteers.find(volunteer => volunteer.name == name);

        return volunteer != null? volunteer.id : 0;
    }

    const [log, setLog] = useState({
        userId: getIdFromName(logToEdit.name),
        activity: logToEdit.activity,
        project: logToEdit.project,
        duration: {hours: logToEdit.hours, minutes: 0, seconds: 0},
        startedAt: new Date(logToEdit.date),
    })

    //close modal if clicked outside of it
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    useEffect(()=>{
        if(loading){
            getOptions();
            getNote();
        }
            
        if(!loading && document.getElementById('Log Form')){
            let potentialLog = {
                userId: parseInt(getSelected(document.getElementById('Volunteer'))),
                activity: getSelected(document.getElementById('Activity')),
                project: getSelected(document.getElementById('Project')),
                duration: getDuration(document.getElementById('Start Time'),document.getElementById('End Time')),
                startedAt: getDate(document.getElementById("Date"),document.getElementById('Start Time')),
            };

            //validation code
            if(new Date(potentialLog.startedAt) && potentialLog.duration.hours!=0){
                setLog(potentialLog);
                setValid(true);
            }
        }
    })

    const getNote = async () => {
        let {data} = await LogNote.get(logToEdit.ID);
        console.log(data);
        //console.log(data.result[0].notes)
        if(data.result[0].notes)
            setNote(data.result[0].notes);
    }

    const getOptions = async () => {
        const options = {
            projects: await Project.get(),
            activities: await CommunityBusinesses.getVolunteerActivities(),
            volunteers: await CommunityBusinesses.getVolunteers()
        }
        const {data: {result: {id}}} = await Users.getMe();
        console.log(id);
        setMyUserId(id);

        setProjects(getStringArray(options.projects.data.result));
        setActivities(getStringArray(options.activities.data.result));
        setVolunteers(options.volunteers.data.result);

        setLoading(false);
    }    

    const submit = ()=>{
        try{
            Logs.update(myUserId,logToEdit.ID,log)
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
                                <option value={volunteer.id}
                                        selected={volunteer.name==logToEdit.name? true: false}
                                >
                                    {volunteer.name}</option>)} 
                        </select>
                        <select id="Project" name="Project">
                            {projects.map(project=>
                                <option value={project}
                                selected={project==logToEdit.project? true: false}
                                >{project}</option>)} 
                        </select>
                        <select id="Activity" name="Activity">
                            {activities.map(activity=>
                                <option value={activity}
                                        selected={activity==logToEdit.activity? true: false}
                                >{activity}</option>)} 
                        </select>
                        <input type="date" id="Date" value={date}
                            onChange={(e)=>setDate(e.target.value)}
                            //max={todaysDate}
                        />
                        <input type="time" id="Start Time" value={startTime}
                        onChange={(e)=>setStartTime(e.target.value)}
                        />
                        <input type="time" id="End Time" value={endTime}
                        onChange={(e)=>setEndTime(e.target.value)}
                        />
                        <button onClick={()=>setNoteModalVisible(true)}>Edit Note</button>
                        <button onClick={submit}
                        disabled={!valid}
                        >Edit</button>
                        <p>{errorMessage}</p>
                    </div>
                    }
                </div>
            </div>
        );
    else
        return null;

};

export default LogEditModal;