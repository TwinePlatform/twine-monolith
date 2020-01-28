import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';

import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../lib/ui/Page';
import TimeForm from '../../../lib/ui/forms/TimeForm';
import { selectOrderedActivities, loadActivities } from '../../../redux/constants/activities';
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
const AddTime: FC<Props> = () => {
  // redux
  const dispatch = useDispatch();

  const activities = useSelector(selectOrderedActivities);
  const projects = useSelector(selectActiveOrderedProjects);

  // hooks
  useEffect(() => {
    dispatch(loadActivities());
    dispatch(loadProjects());
  }, []);

  return (
    <Page heading="Add Time">
      <TimeForm
        forUser="volunteer"
        activities={activities}
        projects={projects}
      />
    </Page>
  );
};


AddTime.navigationOptions = {
  title: 'Add Time',
};

export default AddTime;
