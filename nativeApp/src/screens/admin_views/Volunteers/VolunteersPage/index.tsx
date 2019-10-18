import React, { FC } from 'react';
// import styled from 'styled-components/native';

import { NavigationFocusInjectedProps } from 'react-navigation';
import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';

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


const Volunteers: FC<NavigationFocusInjectedProps & Props> = ({ navigation }) => (
  <Page heading="Volunteers">
    <AddBar title="Add Volunteer" onPress={() => navigation.navigate('AdminAddVolunteer')} />
    <VolunteerCard id={1} title="Kara Thrace" date="11/11/18" />
    <VolunteerCard id={1} title="Lee Adama" date="11/11/18" />
    <VolunteerCard id={1} title="Hera Agathon" date="11/11/18" />
    <VolunteerCard id={1} title="Tory Foster" date="11/11/18" />
    <VolunteerCard id={1} title="Ellen Tigh" date="11/11/18" />
  </Page>
);

export default Volunteers;
