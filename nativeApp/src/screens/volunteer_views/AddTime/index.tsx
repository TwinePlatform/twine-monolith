import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import {
  Form as F, Item as I, Label as L, Text,
} from 'native-base';

import DateTimePicker from 'react-native-modal-datetime-picker';
import { Heading, FontsEnum } from '../../../lib/ui/typography';
import Input from '../../../lib/ui/forms/InputWithIcon';
import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Forms } from '../../../lib/ui/forms/enums';
import { ColoursEnum } from '../../../lib/ui/colours';
import DatePicker from '../../../lib/ui/forms/DatePicker';
import TimePicker from '../../../lib/ui/forms/TimePicker';

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

  const onConfirmStartTime = (d: Date) => {
    setStartTime(d.getTime().toString());
  };
  return (
    <View>
      <Heading>Add Time</Heading>
      <Form>
        <Dropdown inline={false} label="What project are you volunteering on?" options={projects} selectedValue={project} onValueChange={setProject} />
        <Dropdown inline={false} label="What activity are you doing?" options={activities} selectedValue={activity} onValueChange={setActivity} />
        <DatePicker onDateChange={setDate} />
        <TimePicker value={startTime} onConfirm={onConfirmStartTime} />
      </Form>
    </View>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
