import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';

import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Forms } from '../../../lib/ui/forms/enums';
import DateTimePicker from '../../../lib/ui/forms/DateTimePicker';
import { ColoursEnum } from '../../../lib/ui/colours';
import HoursAndMinutesText from '../../../lib/ui/HoursAndMinutesText';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import Page from '../../../lib/ui/Page';

import { getTimeDiff } from '../../../lib/utils/time';

/*
 * Types
 */
type Props = {
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

const projects = [
  { id: 0, name: 'General' },
  { id: 1, name: 'Spring' },
];

const activities = [
  { id: 0, name: 'Office work' },
  { id: 1, name: 'Support' },
];

const volunteers = [
  { id: 0, name: 'Kara Thrace' },
  { id: 1, name: 'Lee Adama' },
];


/*
 * Component
 */
const AddTime: FC<Props> = () => {
  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const diff = getTimeDiff(startTime, endTime);

  return (
    <Page heading="Add Time">
      <Form>
        <Dropdown label="Volunteer" options={volunteers} selectedValue={volunteer} onValueChange={setVolunteer} />
        <Dropdown label="Project" options={projects} selectedValue={project} onValueChange={setProject} />
        <Dropdown label="Activity" options={activities} selectedValue={activity} onValueChange={setActivity} />
        <DateTimePicker
          label="Date"
          value={date}
          onConfirm={setDate}
          mode="date"
          maxDate={new Date()} // ios only
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
          minDate={startTime} // ios only
        />
        <Label>{`${volunteer || 'Member'} volunteered for`}</Label>
        <TimeContainer>
          <HoursAndMinutesText align="center" timeValues={diff} />
        </TimeContainer>
        <SubmitButton text="ADD TIME" onPress={() => {}} />
      </Form>
    </Page>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
