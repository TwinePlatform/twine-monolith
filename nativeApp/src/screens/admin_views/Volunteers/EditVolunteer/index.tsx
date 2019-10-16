import React, { FC } from 'react';
// import styled from 'styled-components/native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import Page from '../../../../lib/ui/Page';
import EditableUser from '../../../../lib/ui/forms/EditableUser';


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
    <EditableUser onSubmit={() => props.navigation.navigate('Volunteers')} />
  </Page>
);

export default withNavigation(EditVolunteer);
