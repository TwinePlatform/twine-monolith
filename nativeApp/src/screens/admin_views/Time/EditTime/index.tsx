import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
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

const EditTime: FC<NavigationInjectedProps & Props> = ({navigation}) => {

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
        origin="editTime"
        logId={navigation.state.params.logId}
        editLog={{
          volunteer: navigation.state.params.volunteer,
          project: navigation.state.params.labels[0],
          activity: navigation.state.params.labels[1],
          startTime: navigation.state.params.startTime,
          date: navigation.state.params.date,
          hours: navigation.state.params.timeValues[0],
          minutes: navigation.state.params.timeValues[1],
          note: navigation.state.params.note,
        }}
      />
    </Page>
  )
};

export default withNavigation(EditTime);
