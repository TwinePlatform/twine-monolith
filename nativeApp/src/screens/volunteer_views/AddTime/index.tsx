import React, { FC } from 'react';
// import styled from 'styled-components/native';

import Page from '../../../lib/ui/Page';
import TimeForm from '../../../lib/ui/forms/TimeForm';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
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
const AddTime: FC<Props> = () => (
  <Page heading="Add Time">
    <TimeForm
      forUser="volunteer"
      activities={activities}
      projects={projects}
      onSubmit={() => {}}
    />
  </Page>
);


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
