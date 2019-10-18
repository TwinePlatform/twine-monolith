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

const Settings: FC<Props> = () => (
  <Page heading="Settings">
    <UserForm onSubmit={() => {}} />
  </Page>
);

export default Settings;
