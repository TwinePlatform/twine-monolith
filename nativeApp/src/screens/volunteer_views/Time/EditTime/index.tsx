import React, { FC, useEffect } from 'react';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
// import styled from 'styled-components/native';
import Page from '../../../../lib/ui/Page';
import TimeForm from '../../../../lib/ui/forms/TimeForm';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
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
const EditTime: FC<NavigationInjectedProps & Props> = ({navigation}) => {
    const { labels, logId, timeValues, startTime, date} = navigation.state.params;

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

    console.log(timeValues)

    return (
        //ToDo: Prefield with passed data
        // TODO: Add submit to backend when onSubmit 
        <Page heading="Volunteer Edit Time">
            <TimeForm
                forUser="volunteer"
                logId={logId}
                projects={projects}
                activities={activities}
                volunteers={volunteers}
                editLog={{
                    volunteer: "",
                    project: labels[0],
                    activity: labels[1],
                    startTime: startTime,
                    date: date,
                    hours: timeValues[0],
                    minutes: timeValues[1],
                    note: "",
                  }}
                origin='editTime'
            />
        </Page>
    )
};

export default withNavigation(EditTime);
