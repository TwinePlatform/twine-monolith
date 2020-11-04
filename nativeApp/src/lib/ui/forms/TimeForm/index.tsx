import React, { FC, useState, useEffect } from 'react';
import { StorageValuesEnum } from '../../../../authentication/types';
import styled from 'styled-components/native';
import { Form as F, Text, View } from 'native-base';
import { Platform, AsyncStorage, TextInput } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { useDispatch, useSelector } from 'react-redux';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Dropdown from '../Dropdown';
import DropdownTime from '../DropdownTime';
import FuzzySearchBox from '../FuzzySearchBox';
import { Forms } from '../enums';
import DatePicker from '../DatePicker';
import { ColoursEnum } from '../../colours';
import { HourAndMinutesText, TimeDiff } from '../../HoursAndMinutesText';
import SubmitButton from '../SubmitButton';
import NoteButton from '../../NoteButton';

import { getTimeLabel } from './helpers';
import { createLog, selectCreateLogStatus, createLogReset, updateLog } from '../../../../redux/entities/logs';
import { IdAndName } from '../../../../api';
import { User } from '../../../../../../api/src/models';
import SavedModal from '../../modals/SavedModal';
import NoteModal from '../../modals/NoteModal';
import MessageModal from '../../modals/MessageModal';
import useToggle from '../../../hooks/useToggle';

import API from '../../../../api';
import BadgeModal from '../../modals/BadgeModel';
import { BadgeObj } from './../../../../screens/volunteer_views/VolunteerHome/BadgeObject';

import * as yup from 'yup';
import { Formik } from 'formik';

import { AddVolunteerButton, VolunteerButton } from '../AddVolunteerButton';
import { AnyAaaaRecord } from 'dns';

/*
 * Types
 */
export type TimeValues = {
  project: string;
  activity: string;
  volunteer: string;
  date: Date;
  startTime: Date;
  endTime: Date;

}
type Props = {
  defaultValues?: TimeValues;
  activities: IdAndName[];
  projects: IdAndName[];
  volunteers?: User[];
  forUser: 'admin' | 'volunteer'; // TODO replace with role enum from api
  logId?: string;
  selectedProject?: string;
  selectedActivity?: string;
  origin: string;
  editLog?: any;
}

/*
 * Styles
 */

const Form = styled(F)`
  width: ${Forms.formWidth}
`;

const Label = styled(Text)`
  color: ${ColoursEnum.darkGrey};
  marginTop: 15;
`;

const TimeContainer = styled.View`
  marginTop: 15;
`;

const TimeContainerItem = styled.View`
  alignItems: center;
`;

const NoteContainer = styled.View`
  justifyContent: space-between;
  flexDirection: row;
  marginTop: 30;
`;

const AddVolContainer = styled.View`
  width: 100%;
  flexWrap: wrap;
  justifyContent: flex-start;
  flexDirection: row;
  marginTop: 10;
`;

const zeroToNine = [0,1,2,3,4,5,6,7,8,9];
const zeroToFiftyFive = [0,5,10,15,20,25,30,35,40,45,50,55];
/*
 * Component
 */
const TimeForm: FC<Props & NavigationInjectedProps> = (props) => {
  const {
    forUser, logId, origin, activities, projects, volunteers, selectedProject, selectedActivity, editLog, navigation //, timeValues
  } = props;

  // redux
  const dispatch = useDispatch();

  const requestStatus = useSelector(selectCreateLogStatus);
  
  const [logSent, setLogSent] = useState(0); //when logs are sent using the form, this increases, triggering the saved modal to check if it should be on. 
  const [logJustSent, setLogJustSent] = useState(false); //tracks whether it was sent in the last 2 seconds.
 
  // local state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [responseModal, setResponseModal] = useState(false);
  const [badgeModal, setBadgeModal] = useState(false);
  const [noteModalVisible, toggleNoteInvisibility] = useToggle(false);
  const [errorModalVisible, toggleErrorInvisibility] = useToggle(false);
  const durationErrorMessage = "Please select a duration!";

  let volunteer, setVolunteer;
  let project, setProject;
  let activity, setActivity;
  let startTime, setStartTime;
  let date, setDate;
  let hours, setHours;
  let minutes, setMinutes;
  let note, setNote;

   

  if( origin == 'editTime'){
    //console.log(new Date(editLog.date + 'T' + editLog.startTime));

    console.log(editLog);

    [volunteer, setVolunteer] = useState(editLog.volunteer);
    [project, setProject] = useState(editLog.project);
    [activity, setActivity] = useState(editLog.activity);
    [startTime, setStartTime] = useState<Date>(new Date(editLog.startTime));
    [date, setDate] = useState<Date>(new Date(editLog.date));
    [hours, setHours] = useState<number>(editLog.hours);
    [minutes, setMinutes] = useState<number>(editLog.minutes);
    [note, setNote] = useState(editLog.note);
  }
  else{
    [volunteer, setVolunteer] = useState("");
    [project, setProject] = useState(selectedProject);
    [activity, setActivity] = useState(selectedActivity);
    [startTime, setStartTime] = useState<Date>(new Date);
    [date, setDate] = useState<Date>(new Date);
    [hours, setHours] = useState<number>(0);
    [minutes, setMinutes] = useState<number>(0);
    [note, setNote] = useState('');
  }

  const [userId, setUserID] = useState<number>();
  const [badge, setBadge] = useState(Object());
  const [addVolArr, setAddVolArr] = useState([]);

  const getIdFromName = (volunteerName) => {
    return volunteers.find((x) => x.name === volunteerName).id
  }

  if (forUser == 'admin') {
    //setUserID(volunteers.find((x) => x.name === volunteer).id);
  }
  if (forUser == 'volunteer') {
    AsyncStorage.getItem(StorageValuesEnum.USER_ID).then(userID => setUserID(parseInt(userID)))
  }

  const CheckConnectivity = async (logData) => {
    await NetInfo.fetch()
      .then(state => {
        if (state.isConnected) {
          console.log('connected to internet');
        } else {
          cache(logData);
        }
        return state.isConnected;
      })
  }

  const resetValues = () => {
    console.log("resetting")

    setStartTime(new Date());
    setDate(new Date);
    setProject(selectedProject);
    setActivity(selectedActivity);
    setHours(0);
    setMinutes(0);
    setNote('');
    setVolunteer("");
    setAddVolArr([]);
  };

  //function to cache value in asynchstorage
  const cache = async (values) => {
    let cachevalue;
    let cachevalueString = await AsyncStorage.getItem('log cache');
    cachevalue = cachevalueString == null ? [] : JSON.parse(cachevalue);
    cachevalue.push(values);
    await AsyncStorage.setItem(
      'log cache',
      JSON.stringify(cachevalue)
    );
  }

  const cacheforEdit = async (values) => {
    let cacheValueString = await AsyncStorage.getItem('edit log cache');
    let cachevalue;
    if (cacheValueString == null)
      cachevalue = [];
    else
      cachevalue = JSON.parse(cachevalue);

    cachevalue.push(values);
    await AsyncStorage.setItem(
      'edit log cache',
      JSON.stringify(cachevalue)
    );

  }

  // hooks
  useEffect(() => {
    if (logJustSent && requestStatus.success)
      setResponseModal(true);

  }, [logSent]);



  // handlers
  const onSubmit = async (volunteer, project, activity, startTime, note) => {

    console.log(startTime.toISOString());

    if (hours === 0 && minutes === 0) {
      toggleErrorInvisibility();
    } else {
      const values = {
        project,
        activity,
        startedAt: startTime.toISOString(),
        duration: { hours, minutes, seconds:0 },
        userId: forUser == 'volunteer' ? userId : getIdFromName(volunteer),
        note
      };

      CheckConnectivity(values);

      //if timeform is called from add time view 
      if (origin != "editTime") {
        try { //error trapping and cache log when network error
          console.log("adding time");

          const res: any = await dispatch(createLog(values));
          
          setLogJustSent(true);
          setTimeout(()=>setLogJustSent(false),2000);
          setLogSent(logSent+1);

          console.log(res)

          if(res.status == 200){
            if (values.note != "") {
              API.Notes.set(values.note, res.data.id, values.activity, values.project, values.startedAt)
            }
          }
          if (res.status == 500) {
            cache(values);
          }
          if (res.status == 400) {
            console.log(res.statusText);
            //ToDo: error trapping here 
          }
    
        } catch (error) {
          console.log(error);
        }

        //check for badge acheive and trigger badge reward
        if (forUser == 'volunteer') {
          try {
            const checkBadge = await API.Badges.checkNupdate();
            Promise.all(checkBadge.map(badge => {
              setBadge(BadgeObj[badge]);
              setBadgeModal(true);
              setTimeout(() => {
                setBadgeModal(false);
              }, 3000)
            }));
            // ToDo: enable multiple badges to be awarded at the same time
          } catch (error) {
            console.log(error);
          }
        }
      }

      //if timeform is called from edit time view 
      if (origin == "editTime") {
        if(forUser == "admin")
          setUserID(getIdFromName(volunteer));

        const valuesEdit: any = {
          project,
          activity,
          startedAt: startTime.toISOString(),
          duration: { hours, minutes, seconds:0 },
          note
        };

        console.log(valuesEdit)
        console.log("userID" + userId)

        try { //error trapping and cache log when network error
          const res: any = await dispatch(updateLog(userId, parseInt(logId), valuesEdit));
          
          setLogJustSent(true);
          setTimeout(()=>setLogJustSent(false),2000);
          setLogSent(logSent+1);

          console.log(res);

          if(res.status == 200){
            if (valuesEdit.note != "") {
              API.Notes.set(valuesEdit.note, res.data.id, valuesEdit.activity, valuesEdit.project, valuesEdit.startedAt)
            }
          }
          
        if (res.status == 500) {
          valuesEdit.userId = userId;
          valuesEdit.logId = logId;
          cacheforEdit(valuesEdit);
        }
        if (res.status == 400) {
          console.log(res.statusText);
          //ToDo: error trapping here 
        }
        console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
   
      if (forUser == 'volunteer') {
        setTimeout(()=>{
          setResponseModal(false);
          navigation.navigate('Home');
        },1000);
      }
    }
  };

  const addNote = (note) => {
    setNote(note);
  };

  const addVolunteer = (values) => {
    setAddVolArr(addVolArr => [...addVolArr, values]);
  }

  const deleteVolunteer = (volunteerName) => {
    const removed = addVolArr.filter(volunteer => volunteer != volunteerName);
    setAddVolArr(removed);
  }


  const onContinue = () => {
    dispatch(createLogReset());
    // resetForm();
    setResponseModal(false);
  };

  const validationSchema = yup.object().shape({
    // yup.object().shape({
    project: yup
      .string()
      .min(3, 'error')
      .required('enter a project'),
    activity: yup
      .string()
      .min(3, 'error')
      .required('enter an activity'),
  });

  return (

    <Formik
      initialValues={{ volunteer: '', project: selectedProject, activity: selectedActivity, note: '', hours,minutes }}
      //validationSchema={validationSchema} removed as there is always an initial project or activity selected
      onSubmit={(values, date,) => {

        if (addVolArr.length == 0) {
          console.log(values)
          onSubmit(volunteer, project, activity, startTime, note);
        } else if (addVolArr.length >= 1) {
          if(volunteer != "")
            addVolArr.push(volunteer); //add the active volunteer to the array

          addVolArr.map(volunteer => {
            console.log(volunteer)
            onSubmit(volunteer, project, activity, startTime, note);
          })
        }

        resetValues();

      }}>

      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

        <Form>

          <BadgeModal
            visible={badgeModal}
            badge={badge}
          />

          <SavedModal
            isVisible={responseModal}
            onContinue={onContinue}
          />

          <NoteModal
            isVisible={noteModalVisible}
            addNote={addNote}
            initialNote={note}
            onClose={toggleNoteInvisibility}
          />

          <MessageModal
            isVisible={errorModalVisible}
            message={durationErrorMessage}
            onClose={() => { toggleErrorInvisibility(); }}
          />

          {forUser === 'admin' &&
            <FuzzySearchBox
              label="Volunteer"
              placeholder={"Search volunteers"}
              options={volunteers}
              selectedValue={volunteer}
              onValueChange={volunteer=>{setVolunteer(volunteer)}}
              onBlur={handleBlur('volunteer')}
              value={volunteer}
            />
          }

          <AddVolContainer>
            {addVolArr !== [] && addVolArr.map(volunteer => {
              return (
                <VolunteerButton text={volunteer} onPress={() => deleteVolunteer(volunteer)} />
              )
            })}
          </AddVolContainer>

          {forUser === 'volunteer' && <Label>What project are you volunteering on?</Label>}

          <Dropdown
            label="Project"
            options={projects}
            selectedValue={project}
            onValueChange={project=>setProject(project)}
            onBlur={handleBlur('project')}
            value={project}
          />

          {errors.project &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.project}</TextInput>
          }

          {forUser === 'volunteer' && <Label>What activity are you doing?</Label>}

          <Dropdown
            label="Activity"
            options={activities}
            selectedValue={activity}
            onValueChange={activity=>setActivity(activity)}
            value={activity}
          />
          {errors.activity &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.activity}</TextInput>
          }

          <DatePicker
            label="Start Date"
            value={startTime}
            onConfirm={(newDate) => setStartTime(newDate)}
            mode="date"
            forUser={forUser}
            maxDate={new Date()}
            pickerVisible={pickerVisible}
            openPicker={()=>setPickerVisible(true)}
            closePicker={()=>setPickerVisible(false)}
          />

          <DropdownTime
            label="Hours"
            options={zeroToNine}
            selectedValue={hours}
            onValueChange={setHours}
            defaultValue={hours}
          />

          <DropdownTime
            label="Minutes"
            options={zeroToFiftyFive}
            selectedValue={minutes}
            onValueChange={setMinutes}
            defaultValue={minutes}
          />

          <NoteContainer>
            {forUser === 'admin' && origin!="editTime" && <AddVolunteerButton text="Add Another" onPress={() => {addVolunteer(volunteer);setVolunteer("")}} />}
            {origin =="editTime"?
              <NoteButton label={"Edit note"} onPress={toggleNoteInvisibility} />
            :
              <NoteButton label={"Add note"} onPress={toggleNoteInvisibility} />}
          </NoteContainer>

          <TimeContainer>
            <Label>{getTimeLabel(forUser, values.volunteer)}</Label>
            <HourAndMinutesText align="center" timeValues={[hours, minutes]} />
          </TimeContainer>

          {origin != "addTime" && origin != "editTime" && <SubmitButton text="ADD TIME" onPress={handleSubmit} />}
          {origin === "addTime" && <SubmitButton text="ADD TIME" onPress={handleSubmit} />}
          {origin === "editTime" && <SubmitButton text="EDIT TIME" onPress={handleSubmit} />}
        </Form>

      )}
    </Formik>
  );
};

export default withNavigation(TimeForm);