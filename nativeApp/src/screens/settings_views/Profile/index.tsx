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
const Profile: FC<Props> = () => (
  <Page heading="Profile">
    <UserForm onSubmit={() => { }} />
  </Page>
);

export default Profile;
