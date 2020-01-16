import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';

import { useDispatch } from 'react-redux';
import Dropdown from '../Dropdown';
import { Forms } from '../enums';
import DateTimePicker from '../DateTimePicker';
import { ColoursEnum } from '../../colours';
import HoursAndMinutesText from '../../HoursAndMinutesText';
import SubmitButton from '../SubmitButton';

import { getTimeLabel } from './helpers';
import { createLog } from '../../../../redux/entities/logs';
import { IdAndName } from '../../../../api';
import { User } from '../../../../../../api/src/models';


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
  onSubmit: (v: TimeValues) => void;
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

const zeroToNine = [...Array(10).keys()].map((_, i) => ({ id: i, name: `${i}` }));
const zeroToFiftyNine = [...Array(60).keys()].map((_, i) => ({ id: i, name: `${i}` }));
/*
 * Component
 */
const TimeForm: FC<Props> = (props) => {
  const dispatch = useDispatch();

  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [date, setDate] = useState<Date>();
  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();


  const {
    forUser, activities, projects, volunteers,
  } = props;

  const onSubmit = () => {
    const values = {
      project,
      activity,
      startedAt: date.toDateString(),
      duration: { hours, minutes },
      userId: volunteers.find((x) => x.name === volunteer).id,
    };
    dispatch(createLog(values));
  };

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
      <Label>{getTimeLabel(forUser, volunteer)}</Label>
      <TimeContainer>
        <HoursAndMinutesText align="center" timeValues={[hours, minutes]} />
      </TimeContainer>
      <SubmitButton text="ADD TIME" onPress={onSubmit} />
    </Form>
  );
};

export default TimeForm;
