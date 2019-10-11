import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import {
  Form as F, Item, Label,
} from 'native-base';
import TimePicker from 'react-native-simple-time-picker';

import DateTimePicker from 'react-native-modal-datetime-picker';
import { Heading, FontsEnum } from '../../../lib/ui/typography';
import Input from '../../../lib/ui/forms/InputWithIcon';
import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Forms } from '../../../lib/ui/forms/enums';
import { ColoursEnum } from '../../../lib/ui/colours';
import DatePicker from '../../../lib/ui/forms/DatePicker';

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

const Value = styled.Text`
  fontColor: ${ColoursEnum.darkGrey}
`;

const PlaceHolder = styled.Text`
  fontSize: 15;
  color: ${ColoursEnum.grey};
  paddingTop: 10;
  paddingBottom: 10;
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
const AddTime: FC<Props> = (props) => {
  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState();
  const [startTime, setStartTime] = useState();
  const [isStartTimeVisible, setIsStartTimeVisible] = useState(false);
  return (
    <View>
      <Heading>Add Time</Heading>
      <Form>
        <Dropdown inline={false} label="What project are you volunteering on?" options={projects} selectedValue={project} onValueChange={setProject} />
        <Dropdown inline={false} label="What activity are you doing?" options={activities} selectedValue={activity} onValueChange={setActivity} />
        <DatePicker onDateChange={setDate} />
        {/* <TimePicker /> */}
        <Item>
          <Label>Start Time</Label>
          {startTime
            ? <Value>{startTime}</Value>
            : <PlaceHolder>Select time</PlaceHolder>}
          <DateTimePicker isVisible={isStartTimeVisible} mode="time" onConfirm={setStartTime} onCancel={() => {}} />
        </Item>
      </Form>
    </View>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};
export default AddTime;
