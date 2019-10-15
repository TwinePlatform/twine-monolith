import React, { FC } from 'react';

import Page from '../../../lib/ui/Page';
import EditableUser from '../../../lib/ui/forms/EditableUser';
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
    <EditableUser onSubmit={() => {}} />
  </Page>
);

export default Settings;
