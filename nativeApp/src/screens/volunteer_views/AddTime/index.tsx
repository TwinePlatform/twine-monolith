import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';

import { Heading } from '../../../lib/ui/typography';
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
  marginTop: 10;
`;

const TimeContainer = styled.View`
  marginTop: 10;
`;

const projects = [
  { id: 0, name: 'General' },
  { id: 1, name: 'Spring' },
];

const activities = [
  { id: 0, name: 'Office work' },
  { id: 1, name: 'Support' },
];


/*
 * Component
 */
const AddTime: FC<Props> = () => {
  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const diff = getTimeDiff(startTime, endTime);

  return (
    <Page>
      <Heading>Add Time</Heading>
      <Form>
        <Label>What project are you volunteering on?</Label>
        <Dropdown label="Project" options={projects} selectedValue={project} onValueChange={setProject} />
        <Label>What activity are you doing?</Label>
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
        <Label>You volunteered for</Label>
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
