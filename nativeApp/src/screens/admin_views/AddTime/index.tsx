import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';

import { NavigationInjectedProps } from 'react-navigation';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../lib/ui/Page';
import TimeForm from '../../../lib/ui/forms/TimeForm';
import { loadActivities, selectOrderedActivities } from '../../../redux/constants/activities';
import { loadVolunteers, selectOrderedVolunteers } from '../../../redux/entities/volunteers';
import { selectActiveOrderedProjects, loadProjects } from '../../../redux/entities/projects';


/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */


/*
 * Component
 */
const AddTime: FC<NavigationInjectedProps & Props> = () => {
  // redux
  const dispatch = useDispatch();

  const activities = useSelector(selectOrderedActivities);
  const volunteers = useSelector(selectOrderedVolunteers);
  const projects = useSelector(selectActiveOrderedProjects);

  // hooks
  useEffect(() => {
    dispatch(loadActivities());
    dispatch(loadVolunteers());
    dispatch(loadProjects());
  }, []);

  return (
    <Page heading="Add Time">
      <TimeForm
        forUser="admin"
        projects={projects}
        activities={activities}
        volunteers={volunteers}
        origin='addTime'
      />
    </Page>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
