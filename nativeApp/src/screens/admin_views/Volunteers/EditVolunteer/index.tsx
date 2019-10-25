import React, { FC } from 'react';
// import styled from 'styled-components/native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import Page from '../../../../lib/ui/Page';
import UserForm from '../../../../lib/ui/forms/UserForm';


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

// TODO add types
const EditVolunteer: FC<NavigationInjectedProps<any> & Props> = ({ navigation }) => (
  <Page heading="Edit Volunteer">
    <UserForm onSubmit={() => navigation.navigate('Volunteers')} initialValues={navigation.state.params} />
  </Page>
);

export default withNavigation(EditVolunteer);
