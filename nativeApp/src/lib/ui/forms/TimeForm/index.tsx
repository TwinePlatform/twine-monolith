import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';
import { NetInfo, Platform, AsyncStorage } from "react-native";

import { useDispatch, useSelector } from 'react-redux';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Dropdown from '../Dropdown';
import FuzzySearchBox from '../FuzzySearchBox';
import { Forms } from '../enums';
import DateTimePicker from '../DateTimePicker';
import { ColoursEnum } from '../../colours';
import HoursAndMinutesText from '../../HoursAndMinutesText';
import SubmitButton from '../SubmitButton';
import NoteButton from '../../NoteButton';

import { getTimeLabel } from './helpers';
import { createLog, selectCreateLogStatus, createLogReset } from '../../../../redux/entities/logs';
import { IdAndName } from '../../../../api';
import { User } from '../../../../../../api/src/models';
import SavedModal from '../../modals/SavedModal';
import NoteModal from '../../modals/NoteModal';
import useToggle from '../../../hooks/useToggle';

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

const NoteContainer = styled.View`
  justifyContent: space-between;
  flexDirection: row;
`;

const zeroToNine = [...Array(10).keys()].map((_, i) => ({ id: i, name: `${i}` }));
const zeroToFiftyNine = [...Array(60).keys()].map((_, i) => ({ id: i, name: `${i}` }));

/*
 * Component
 */
const TimeForm: FC<Props & NavigationInjectedProps> = (props) => {
  const {
    forUser, activities, projects, volunteers,
  } = props;

  // redux
  const dispatch = useDispatch();

  const requestStatus = useSelector(selectCreateLogStatus);

  // local state
  const [responseModal, toggleResponseModal] = useToggle(false);
  const [noteModalVisible, toggleNoteInvisibility] = useToggle(false);

  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [date, setDate] = useState<Date>(new Date);
  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();
  const [note, setNote] = useState('');

  const resetForm = () => {
    setDate(new Date);
    setHours(undefined);
    setMinutes(undefined);
    setNote('');
  };

  const CheckConnectivity = async (logData) => {
    await NetInfo.isConnected.fetch()
      .then(isConnected => {
        if (isConnected) {
          console.log('connected to internet');
        } else {
          cache(logData);
        }
        return isConnected;
      })
  };

  const cache = async (values) => {

    var cachevalue = await AsyncStorage.getItem('log cache');
    cachevalue = cachevalue == null ? [] : JSON.parse(cachevalue);
    cachevalue.push(values);
    await AsyncStorage.setItem(
      'log cache',
      JSON.stringify(cachevalue)
    );

  }

  // hooks
  useEffect(() => {
    if (requestStatus.success) {
      toggleResponseModal();
    }
  }, [requestStatus]);

  // handlers
  const onSubmit = async () => {
    const values = {
      project,
      activity,
      startedAt: date as string,
      duration: { hours, minutes },
      userId: volunteers.find((x) => x.name === volunteer).id,
      note
    };
    CheckConnectivity(values);
    try { //error trapping and cache log when network error
      const res = await dispatch(createLog(values));
      if (res.error.statusCode == 500) {
        cache(values);
      }
      if (res.error.statusCode == 400) {
        console.log(res.error.message);
        //ToDo: error trapping here 
      }
    } catch (error) {
      console.log(error);
    }
  };


  const onContinue = () => {
    dispatch(createLogReset());
    resetForm();
    // toggleResponseModal(); ??
  };

  return (
    <Form>
      <SavedModal
        isVisible={responseModal}
        onContinue={onContinue}
      />
      <NoteModal
        isVisible={noteModalVisible}
        addNote={setNote}
        onClose={toggleNoteInvisibility}
      />
      {forUser === 'admin' && <FuzzySearchBox label="Volunteer" placeholder={"Search volunteers"} options={volunteers} selectedValue={volunteer} onValueChange={setVolunteer} />}
      {forUser === 'volunteer' && <Label>What project are you volunteering on?</Label>}
      <Dropdown label="Project" options={projects} selectedValue={project} onValueChange={setProject} />
      {forUser === 'volunteer' && <Label>What activity are you doing?</Label>}
      <Dropdown label="Activity" options={activities} selectedValue={activity} onValueChange={setActivity} />
      <DateTimePicker
        label="Date"
        value={date}
        onConfirm={setDate}
        mode="date"
        maxDate={new Date()}
      />
      <Dropdown
        label="Hours"
        options={zeroToNine}
        selectedValue={hours}
        onValueChange={setHours}
      />
      <Dropdown
        label="Minutes"
        options={zeroToFiftyNine}
        selectedValue={minutes}
        onValueChange={setMinutes}
      />
      <NoteContainer>
        <Label>{getTimeLabel(forUser, volunteer)}</Label>
        <NoteButton label={"Add note"} onPress={toggleNoteInvisibility} />
      </NoteContainer>
      <TimeContainer>
        <HoursAndMinutesText align="center" timeValues={[hours, minutes]} />
      </TimeContainer>
      <SubmitButton text="ADD TIME" onPress={onSubmit} />
    </Form>
  );
};

export default withNavigation(TimeForm);