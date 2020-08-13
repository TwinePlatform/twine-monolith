import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';
import Page from '../../../../lib/ui/Page';
import TimeForm from '../../../../lib/ui/forms/TimeForm';
import { useDispatch, useSelector } from 'react-redux';
import { loadActivities, selectOrderedActivities } from '../../../../redux/constants/activities';
import { loadVolunteers, selectOrderedVolunteers } from '../../../../redux/entities/volunteers';
import { selectActiveOrderedProjects, loadProjects } from '../../../../redux/entities/projects';

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
// redux

const EditTime: FC<Props> = () => {

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
    <Page heading="Edit Time">
      <TimeForm
        forUser="admin"
        projects={projects}
        activities={activities}
        volunteers={volunteers}
        onSubmit={() => { }}
      />
    </Page>
  )
};

export default EditTime;
