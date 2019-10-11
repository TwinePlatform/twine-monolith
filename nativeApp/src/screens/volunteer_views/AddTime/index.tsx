import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';

import { Heading } from '../../../lib/ui/typography';
import Input from '../../../lib/ui/forms/InputWithIcon';
import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Forms } from '../../../lib/ui/forms/enums';

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
const AddTime: FC<Props> = (props) => {
  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  return (
    <View>
      <Heading>Add Time</Heading>
      <Form>
        <Dropdown isInline={false} label="What project are you volunteering on?" options={projects} selectedValue={project} onValueChange={setProject} />
        <Dropdown label="What activity are you doing?" options={activities} selectedValue={activity} onValueChange={setActivity} />
        {/* <Input /> */}
      </Form>
    </View>
  );
};

AddTime.navigationOptions = {
  title: 'Add Time',
};
export default AddTime;
