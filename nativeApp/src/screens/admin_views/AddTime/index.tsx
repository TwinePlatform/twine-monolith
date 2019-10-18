import React, { FC } from 'react';
// import styled from 'styled-components/native';

import { NavigationInjectedProps } from 'react-navigation';
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

const activities = [
  { id: 0, name: 'Office work' },
  { id: 1, name: 'Support' },
];

const volunteers = [
  { id: 0, name: 'Kara Thrace' },
  { id: 1, name: 'Lee Adama' },
];


const projects = [
  { id: 0, name: 'General' },
  { id: 1, name: 'Community Food Project' },
];

/*
 * Component
 */
const AddTime: FC<NavigationInjectedProps & Props> = () => (
  <Page heading="Add Time">
    <TimeForm
      forUser="admin"
      projects={projects}
      activities={activities}
      volunteers={volunteers}
      onSubmit={() => {}}
    />
  </Page>
);


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
