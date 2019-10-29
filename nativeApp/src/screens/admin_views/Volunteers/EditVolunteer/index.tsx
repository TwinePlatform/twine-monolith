import React, { FC } from 'react';
import uuid from 'uuid/v4';

import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { filter } from 'ramda';
import Page from '../../../../lib/ui/Page';
import UserForm from '../../../../lib/ui/forms/UserForm';
import { CommunityBusinesses } from '../../../../lib/api';


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
const EditVolunteer: FC<NavigationInjectedProps<any> & Props> = ({ navigation }) => {
  const onSubmit = async (formState) => {
    try {
      const changeset = filter(Boolean, formState);
      await CommunityBusinesses.editVolunteer(changeset); // TODO not use ramda
      // TODO modal to show data has been saved
      navigation.navigate('Volunteers', { reload: uuid() });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Page heading="Edit Volunteer">
      <UserForm onSubmit={onSubmit} initialValues={navigation.state.params} />
    </Page>
  );
};

export default withNavigation(EditVolunteer);
