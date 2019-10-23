import React, { FC } from 'react';
// import styled from 'styled-components/native';
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
const AddVolunteer: FC<Props> = () => (
  <Page heading="Add Volunteer">
    <UserForm onSubmit={() => {}} />
  </Page>
);

export default AddVolunteer;
