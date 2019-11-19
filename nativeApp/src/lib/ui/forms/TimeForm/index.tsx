import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';

import Dropdown from '../Dropdown';
import { Forms } from '../enums';
import DateTimePicker from '../DateTimePicker';
import { ColoursEnum } from '../../colours';
import HoursAndMinutesText from '../../HoursAndMinutesText';
import SubmitButton from '../SubmitButton';

import { getTimeDiff } from '../../../utils/time';
import { getTimeLabel } from './helpers';


/*
 * Types
 */
export type IdAndName = { id: number; name: string }
export type TimeValues = {
  project: string;
  activity: string;
  volunteer: string;
  date: Date;
  startTime: Date;
  endTime: Date;

}
type Props = {
  onSubmit: (v: TimeValues) => void;
  defaultValues?: TimeValues;
  activities: IdAndName[];
  projects: IdAndName[];
  volunteers?: IdAndName[];
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


/*
 * Component
 */
const TimeForm: FC<Props> = (props) => {
  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const diff = getTimeDiff(startTime, endTime);

  const {
    forUser, activities, projects, volunteers,
  } = props;
  return (
    <Form>
      {forUser === 'admin' && <Dropdown label="Volunteer" options={volunteers} selectedValue={volunteer} onValueChange={setVolunteer} />}
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
      <DateTimePicker
        label="Start Time"
        value={startTime}
        onConfirm={setStartTime}
        mode="time"
      />
      <DateTimePicker
        label="End Time"
        value={endTime}
        onConfirm={setEndTime}
        mode="time"
        minDate={startTime}
      />
      <Label>{getTimeLabel(forUser, volunteer)}</Label>
      <TimeContainer>
        <HoursAndMinutesText align="center" timeValues={diff} />
      </TimeContainer>
      <SubmitButton text="ADD TIME" onPress={() => {}} />
    </Form>
  );
};

export default TimeForm;
