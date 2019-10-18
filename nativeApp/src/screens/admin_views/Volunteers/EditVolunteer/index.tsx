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
const EditVolunteer: FC<NavigationInjectedProps & Props> = (props) => (
  <Page heading="Edit Volunteer">
    <UserForm onSubmit={() => props.navigation.navigate('Volunteers')} />
  </Page>
);

export default withNavigation(EditVolunteer);
