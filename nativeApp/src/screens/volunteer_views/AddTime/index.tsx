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
import TimeForm from '../../../lib/ui/forms/TimeForm';

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
  { id: 1, name: 'Community Food Project' },
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
    <Page heading="Add Time">
      <TimeForm
        forUser="volunteer"
        activities={activities}
        projects={projects}
        onSubmit={() => {}}
      />
    </Page>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
