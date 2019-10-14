import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';

import { Heading } from '../../../lib/ui/typography';
import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Forms } from '../../../lib/ui/forms/enums';
import DateTimePicker from '../../../lib/ui/forms/DateTimePicker';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

const Form = styled(F)`
  width: ${Forms.formWidth}
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
  const [date, setDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  return (
    <View>
      <Heading>Add Time</Heading>
      <Form>
        <Dropdown inline={false} label="What project are you volunteering on?" options={projects} selectedValue={project} onValueChange={setProject} />
        <Dropdown inline={false} label="What activity are you doing?" options={activities} selectedValue={activity} onValueChange={setActivity} />
        <DateTimePicker label="Date" value={date} onConfirm={setDate} mode="date" />
        <DateTimePicker label="Start Time" value={startTime} onConfirm={setStartTime} mode="time" />
        <DateTimePicker label="End Time" value={endTime} onConfirm={setEndTime} mode="time" />
      </Form>
    </View>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
