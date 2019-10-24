import React, { FC } from 'react';

import Page from '../../../lib/ui/Page';
import UserForm from '../../../lib/ui/forms/UserForm';

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
const Profile: FC<Props> = (props) => (
  <Page heading="Settings">
    <UserForm onSubmit={() => {}} />
  </Page>
);

export default Profile;
