import React, { FC } from 'react';
// import styled from 'styled-components/native';
import Page from '../../../../lib/ui/Page';
import TimeForm from '../../../../lib/ui/forms/TimeForm';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
//get activities from backend, load log
// general for those wihout activity 

const activities = [
    { id: 0, name: 'edit work' },
    { id: 1, name: 'Support' },
    { id: 1, name: 'Committee work, AGM' },
];

const volunteers = [
    { id: 0, name: 'edit Thrace' },
    { id: 1, name: 'Lee Adama' },
];


const projects = [
    { id: 0, name: 'General' },
    { id: 1, name: 'Community Food Project' },
];
/*
 * Component
 */
const EditTime: FC<Props> = (navigation) => {
    const { labels, timeValues } = navigation.navigation.state.params;

    console.log(timeValues);

    return (
        //ToDo: Prefield with passed data
        // TODO: Add submit to backend when onSubmit 
        <Page heading="Volunteer Edit Time">
            <TimeForm
                forUser="volunteer"
                projects={projects}
                activities={activities}
                volunteers={volunteers}
                selectedProject={labels[0]}
                selectedActivity={labels[1]}
                timeValues={timeValues}
                onSubmit={() => { }}
            />
        </Page>
    )
};

export default EditTime;
